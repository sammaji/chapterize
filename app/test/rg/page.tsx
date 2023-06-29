"use client";

import useFragmentedState from "@/lib/useFragmentedState";
import React, { useRef } from "react";

export default function Page() {
	const { timestampString, dispatch, isLoadingTimestamp, setIsLoadingTimestamp } = useFragmentedState();
	const inputRef = useRef<HTMLInputElement>(null!);

	function clickHandler(e: any) {
		const vid = inputRef.current.value;
		alert(vid);
		dispatch(vid, "few").then(() => {
            setIsLoadingTimestamp(false)
        })
	}

	return (
		<div>
			<input placeholder="Enter vid" ref={inputRef} />
			<button onClick={(e) => clickHandler(e)}>Generate</button>
			<p className="whitespace-pre-line">{timestampString || "hello world"}</p>
            <p>{isLoadingTimestamp ? "Loading..." : "Not Loading..."}</p>
		</div>
	);
}
