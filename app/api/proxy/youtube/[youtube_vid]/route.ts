import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const vid = request.nextUrl.searchParams.get("youtube_vid")

    if (!vid) {
        return NextResponse.json({message: "Invalid Video ID"}, {status: 422})
    }

	const timestampApiUrl = `${process.env.NEXT_PUBLIC_TIMESTAMP_API_URL as string}/${vid}?key=${process.env.NEXT_PULIC_OPEN_AI_API_KEY}&model=gpt-3.5-turbo`;
    
    const response = await fetch(timestampApiUrl, {method: 'GET'})
    return response
}
