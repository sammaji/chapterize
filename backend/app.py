import openai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from youtube_transcript_api import YouTubeTranscriptApi

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://aitstamp.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


def parse_transcript(transcript_item):
    start = round(transcript_item['start'], 2)
    end = round(transcript_item['start'] + transcript_item['duration'], 2)
    parsed_transcript = f"{start} - {end}={transcript_item['text']}\n"
    return {'count': len(parsed_transcript), 'content': parsed_transcript}


def parse_transcript_in_chunk(transcript_list, mak_token_size=4096):
    """Assuming one token is spent for every word. This is not true, hence the 70% margin."""
    token_count = 0
    parsed_transcript_chunk = ""
    parsed_transcript_list = []
    for item in transcript_list:
        result = parse_transcript(item)
        if token_count + result['count'] < 0.7 * mak_token_size:
            token_count += result['count']
            parsed_transcript_chunk += result['content']
        else:
            parsed_transcript_list.append(parsed_transcript_chunk)
            token_count = 0
            parsed_transcript_chunk = ""

    return parsed_transcript_list


@app.get("/api/ts")
def get_transcripts_message():
    return {"module": "transcript", "status": "live"}


@app.get("/api/ts/{vid}")
def get_transcripts(vid: str, fmt: str = "string"):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(vid, languages=['en', 'en-US'])
    except:
        raise HTTPException(status_code=404, detail="Item Not Found")
    else:
        if fmt == "json":
            return {'vid': vid, 'transcript': transcript_list}

        transcript_chunk = parse_transcript_in_chunk(transcript_list)
        return {'vid': vid, 'count': len(transcript_chunk), 'transcript': transcript_chunk}


@app.get("/api/tstamp")
def get_timestamps_message():
    return {"module": "timestamps", "status": "live"}


def generate_timestamp(transcript_chunk: str, model: str, qty: str):
    quantity = {
        "few": "Generate 1 timestamp only",
        "normal": "Generate 2 timestamps only",
        "many": "Generate 3 timestamps only"
    }
    messages = [
        {"role": "system",
         "content": "You are a helpful model that generates timestamps from YouTube "
                    "captions. Each timestamp must me short and accurate. You must follow the given "
                    f"format strictly.\n"
                    "Format of Transcript: {startTime} - {endTime}={transcript text}\n"
                    "Format Of Timestamp: {startTime}={oneline short description}\n\n"
                    "---\n"
                    f"{quantity[qty]}"},
        {"role": "user", "content": transcript_chunk}
    ]
    # print(messages[0]['content'])
    response = openai.ChatCompletion.create(model=model, messages=messages)
    return response


@app.get("/api/tstamp/{vid}")
def get_timestamps(vid: str, key: str, model: str = "gpt-3.5-turbo", qty: str = "normal"):
    if key is None:
        raise HTTPException(status_code=401, detail="Please provide a valid API key")

    if qty != "few" and qty != "normal" and qty != "many":
        raise HTTPException(status_code=422, detail="param 'qty' can only be few, normal or many")

    if model != "gpt-3.5-turbo" and model != "gpt-4":
        raise HTTPException(status_code=422, detail="param 'model can only be gpt-3.5-turbo or gpt-4")

    openai.api_key = key
    transcript_list = get_transcripts(vid=vid, fmt="string")['transcript']

    token_count = 0
    response_list = []
    for item in transcript_list:
        response = generate_timestamp(item, model, qty)
        token_count += response["usage"]["total_tokens"]
        response_list.append(response["choices"][0]["message"]["content"])

    return {"vid": vid, "token": token_count, "content": response_list}


@app.get("/api/demo/tstamp/{vid}")
def get_demo_timestamp(vid: str):
    return {"vid": vid, "token": 2082, "content": [
        "0.0=Introduction of app for YouTubers and idea generation\n54.78=Importance of drizzle ORM for database "
        "management",
        "142.44-153.00=Using Prisma Studio and Beaver to interact with SQL database\n163.80-176.34=Using webhooks and "
        "ngrok for local testing of webhooks\n"]}
