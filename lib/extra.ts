export function cn(...rest: string[]) {
    return rest.reduce((acc, value) => {
        return `${value} ${acc}`
    })
}

export function validateYtUrl(url: string): boolean {
  const urlValidationRegex = /(https:\/\/|)(www.|)youtu(|.)be(.com|)\/(watch\?v=|watch\?*&v=|)(\w+)*/;
  return urlValidationRegex.test(url)
}

export function extractVideoId(url: string) {
    let videoId = "";
  
    const regex1 = /youtube\.com\/watch\?v=(\w+)/;
    const regex2 = /youtu\.be\/(\w+)/;
  
    const match1 = url.match(regex1);
    const match2 = url.match(regex2);
  
    if (match1 && match1[1]) {
      videoId = match1[1];
    } else if (match2 && match2[1]) {
      videoId = match2[1];
    }
  
    return videoId;
  }

export function formatSecondsToTimeString(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds)) {
      throw new Error(`Timestamp is NaN`)
    }
  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

export function parseRawTimestamp(timestamp: string[]) {
    let result: string[] = []

    for (let i=0; i<timestamp.length; i++) {
        let element = timestamp[i]?.trim()?.split("\n")
        
        for (let j=0; j<element.length; j++) {
            let parts = element[j].split("=")
            const time = parts[0].split("-")[0]

            try {
              const timestring = formatSecondsToTimeString(Number(time))
              result.push(`${timestring} ${parts[1]}`)
            }
            catch (error: any) {}

            console.log(result.length)
        }
    }
    console.log(result)
    return result;
}


export function timestampArrayToString(timestamp: string[]) {

  if (timestamp.length === 0) return ""

  return timestamp.reduce((acc, curr) => {
    return `${acc}\n${curr}`
  }, "")
}
