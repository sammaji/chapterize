export async function getTranscripts(vid: string) {
    const api_url = process.env.NEXT_PUBLIC_TRANSCRIPT_API_URL as string;
    try {
        const response = await fetch(`${api_url}/${vid}`)        
        const data = await response.json();
        return data;
    } catch(err: any) {
        console.log(err.message || err)
    }
}

export async function getTimestamps(vid: string, transcript_chunk: string, qty: string = "few") {
    const postUrl = `${process.env.NEXT_PUBLIC_MAIN_URL}/api/proxy/tstamp/${vid}`
    const response = await fetch(postUrl, {method: "POST", 
        body: JSON.stringify({
            vid: vid,
            qty: qty,
            content: transcript_chunk
        })
    })
    return (await response.json()).content
}

export async function generateTimestamps(vid: string, qty: string) {
    const transcript: string[] = (await getTranscripts(vid)).transcript

    const timestamp_array: string[] = []
    for (let i=0; i<transcript.length; i++) {
        try {
            const timestamp: string = await getTimestamps(vid, transcript[i], qty)
            console.log(`ts: ${timestamp}`)
            timestamp_array.push(timestamp)
        } catch (error: any) {
            console.error(error.message || "Some unknown error occurred")
        }
    }
    console.log(timestamp_array)
    return timestamp_array
}