import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai"

const wait = (ms: number) => new Promise(
    (resolve, reject) => setTimeout(resolve, ms)
);

export async function POST(request: NextRequest) {
    const body = await request.json()
    const qty =  body.qty || "few"
    const vid = body.vid
    
    if (!vid) {
        return NextResponse.json({message: "Invalid Video ID" }, {status: 422})
    }

    if (!body || !body.content) {
        return NextResponse.json({message: "Invalid Request" }, {status: 422})
    }

    try {
        const configuration = new Configuration({
            apiKey: process.env.OPEN_AI_API_KEY,
        });
        
        const openai = new OpenAIApi(configuration);
        
        const quantity: Record<string, string> = {
            few: "Generate 1 line only",
            normal: "Generate 2 lines only",
            many: "Generate 2 lines only"
        }
        
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "system", content: `You are a helpful model that generates timestamps from YouTube captions. Each timestamp must me short and accurate. You must follow the given format strictly.\nFormat of Transcript: {startTime}-{endTime}={transcript text}\nFormat Of Timestamp: {startTime}={one-line short title}\n---\n${quantity[qty]}`},
             {role: "user", content: body.content}],
        });
        return NextResponse.json({ content: chatCompletion.data.choices[0].message?.content, token: chatCompletion.data.usage?.total_tokens }, {status: 200})
        
        // await wait(3000)
        // return NextResponse.json({content: "0.0=Introduction to importance of typography and spacing\n1.18=Tip 1: Importance of line height in UI design", token: 1024}, {status: 200})
    }
    catch(error: any) {
        return NextResponse.json({ message: error.message || "Some unknown error occurred", body: error }, {status: 404})
    }
}
