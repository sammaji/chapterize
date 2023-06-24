import uvicorn

if __name__ == '__main__':
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)


# def get_timestamps():
#     openai.api_key = ""
#
#     sample_transcript_string = ""
#     sample_ai_response = ""
#     transcript_string = ""
#
#     response = openai.ChatCompletion.create(
#         model="gpt-3.5-turbo",
#         messages=[
#             {"role": "system",
#              "content": "You are a helpful model that generates timestamps (or YouTube Chapters) from YouTube "
#                         "captions. Each timestamp must me short and accurate. You only generate timestamps and "
#                         "nothing else. "
#                         "Format: {startTime} - {oneline description}"},
#             {"role": "user", "content": sample_transcript_string},
#             {"role": "assistant", "content": sample_ai_response},
#             {"role": "user", "content": transcript_string}
#         ]
#     )
#     return response
