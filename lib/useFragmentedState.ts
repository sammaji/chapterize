import { useState } from "react";
import { getTranscripts } from "./openai";
import { formatSecondsToTimeString } from "./extra";

function isValidTimestamp(input: string): boolean {
    const pattern = /^(\d+(\.\d+)?)=(.*)$/;
    return pattern.test(input);
}

export default function useFragmentedState() {
    const [timestampString, setTimestampString] = useState<string>("")
    const [isLoadingTimestamp, setIsLoadingTimestamp] = useState<boolean>(false)

    async function dispatch(vid: string, qty:string = "normal") {
        setIsLoadingTimestamp(true)
        setTimestampString("")

        // fetching transcripts
        const transcript: string[] = await getTranscripts(vid);

        for (let i=0; i < transcript.length; i++) {
            try {
                const response = await fetch("/api/proxy/tstamp", {
                    method: "POST",
                    body: JSON.stringify({ vid, qty, content: transcript[i] })
                })
                const { content } = await response.json()
                const content_array: string[] = content.trim().split("\n")
    
                // client side validation
                // raw timestamp to time string
                const timestamp_chunk: string = content_array.reduce((acc, value) => {
                    if (isValidTimestamp(value)) {
                        let parsed_timestamp = ""
                        try {
                            const x = value.split("=");
                            const t_str = formatSecondsToTimeString(Number(x[0].trim()))
                            parsed_timestamp = `${t_str} ${x[1].trim()}`
                            return `${acc}\n${parsed_timestamp}`
                        } catch {
                            return acc
                        }
                    }
                    return acc
                }, "")
    
                // update state
                setTimestampString((prev) => `${prev}${timestamp_chunk}`)
            } 
            catch (error: any) {
                // when fetching timestamps fails
                console.error(error.message || error)
            }
            // finally {
            //     setIsLoadingTimestamp(false)
            // }
        }
    }

    return { timestampString, setTimestampString, isLoadingTimestamp, setIsLoadingTimestamp, dispatch }
}