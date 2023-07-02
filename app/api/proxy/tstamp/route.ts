import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const qty = body.qty || "few";
  const vid = body.vid;

  if (!vid) {
    return NextResponse.json({ message: "Invalid Video ID" }, { status: 422 });
  }

  if (!body || !body.content) {
    return NextResponse.json({ message: "Invalid Request" }, { status: 422 });
  }

  try {
    const configuration = new Configuration({
      apiKey: process.env.OPEN_AI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    const quantity: Record<string, string> = {
      few: "1",
      normal: "2",
      many: "3",
    };

    const start_prompt = body.start ? "Start from the beginning at 00:00." : "";

    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional YouTube video script writer, a keyword specialist, copywriter and an award winning youtuber with over 10 years of experience in writing click bait keyword title for YouTube videos. Create key timestamps from the part of video transcript given to you. ${start_prompt} I want the timestamp titles to focus on appealing to emotions, curiosity, and eagerness. Generate only timestamps and nothing else.  I want ${quantity[qty]} timestamps only.

                    Here's an example:
                    00:00 Introduction
                    01:29 What is Pareto's Principle?`,
        },
        {
          role: "user",
          content: `Here is the transcript: 
                ${body.content}`,
        },
      ],
    });
    return NextResponse.json(
      {
        content: chatCompletion.data.choices[0].message?.content,
        token: chatCompletion.data.usage?.total_tokens,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Some unknown error occurred", body: error },
      { status: 404 }
    );
  }
}
