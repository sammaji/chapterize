import { useState } from "react";
import { getTranscripts } from "./openai";
import { formatSecondsToTimeString } from "./extra";

function isValidTimestamp(input: string): boolean {
    const pattern = /^(\d+(\.\d+)?)=(.*)$/;
    return pattern.test(input);
}

// function parseTimestamp(timestamp: string) {
//     timestamp = timestamp.replace(/([ ]+|)-([ ]+|)/, "-")

//     const PATTERN_ONE = /^(\s|)(\d+:|)[0-5]\d:[0-5]\d([ ]|=)([a-zA-Z\s,;.]+)/
//     const PATTERN_TWO_START = /^(\s|)(\d+:|)[0-5]\d:[0-5]\d/
//     const PATTERN_TWO_END = /[ |=][a-zA-Z\s,;.]+/

//     if (PATTERN_ONE.test(timestamp)) {
//         return timestamp.trim().replace("=", " ")
//     }

//     const match_start = PATTERN_TWO_START.exec(timestamp)
//     const match_end = PATTERN_TWO_END.exec(timestamp)

//     if (match_start && match_end) {
//         const result = `${match_start[0].trim()}${match_end[0].replace("=", " ")}`
//         return result
//     }
//     return timestamp
// }

export default function useFragmentedState() {
    const [timestampString, setTimestampString] = useState<string>("")
    const [isLoadingTimestamp, setIsLoadingTimestamp] = useState<boolean>(false)

    async function dispatch(vid: string, qty:string = "normal") {
        setIsLoadingTimestamp(true)
        setTimestampString("")

        // fetching transcripts
        const transcript: string[] = await getTranscripts(vid);

        if (!transcript) { alert("Generating failed, please try again!"); return; }

        for (let i=0; i < transcript.length; i++) {
            try {
                const response = await fetch("/api/proxy/tstamp", {
                    method: "POST",
                    body: JSON.stringify({ vid, qty, content: transcript[i], start: (i==0) })
                })
                let { content } = await response.json()
                // const content_array: string[] = content.trim().split("\n")
    
                // // client side validation
                // // raw timestamp to time string
                // const timestamp_chunk: string = content_array.reduce((acc, value) => {
                //     if (isValidTimestamp(value)) {
                //         let parsed_timestamp = ""
                //         try {
                //             const x = value.split("=");
                //             const t_str = formatSecondsToTimeString(Number(x[0].trim()))
                //             parsed_timestamp = `${t_str} ${x[1].trim()}`
                //             return `${acc}\n${parsed_timestamp}`
                //         } catch {
                //             return acc
                //         }
                //     }
                //     return acc
                // }, "")
    
                // update state
                console.log(`ts -> ${content}`)
                setTimestampString((prev) => {
                    // if (content && (typeof content === "string")) {
                    //     content = content.replace("=", " ")
                    // }

                    content = content.replace("=", " ")

                    prev = prev.replace("=", " ")
                    return `${prev}\n${content}`
                })
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