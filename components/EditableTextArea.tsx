"use client";

import React, {
	Dispatch,
	FormEvent,
	HTMLProps,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { TypographyP } from "./Typography";
import {
	BsClipboard2,
	BsClipboard2Check,
	BsPen,
	BsPencil,
} from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { useClipboard } from "@mantine/hooks";
import { cn } from "@/lib/extra";
import { BiCheck, BiPen } from "react-icons/bi";
import { text } from "stream/consumers";

interface EditableTextAreaProps extends HTMLProps<HTMLParagraphElement> {
	isLoading: boolean;
	setTimestampString: Dispatch<SetStateAction<string>>;
	children: string;
}

export default function EditableTextArea(props: EditableTextAreaProps) {
	const clipboard = useClipboard();
	const { isLoading, children, setTimestampString, ...rest } = props;
	const [isContentEditable, setIsContentEditable] = useState<boolean>(false);
	const textRef = useRef<HTMLParagraphElement>(null!);

	const handleInput = (
		event: FormEvent<HTMLElement>,
		setTimestampString: Dispatch<SetStateAction<string>>
	) => {
		if (!isContentEditable) {
			return;
		}
		setTimestampString(event.currentTarget.innerText);
	};

	useEffect(() => {
		if (textRef.current) {
			textRef.current.innerText = children;
		}
	}, [children]);

	return (
		<>
			<div className="w-[100%] h-[42px] flex items-center justify-end gap-2">
				<ImSpinner2
					size={24}
					className={cn(isLoading ? "" : "hidden", "animate-spin text-black")}
				/>
				<p className={cn(isLoading ? "" : "hidden", "text-sm line-clamp-1")}>
					Generating timestamps... Check back here in a minute...
				</p>
				<button
					className={cn(
						isContentEditable && !isLoading ? "" : "hidden",
						"h-[100%] bg-slate-200 text-black flex items-center justify-center gap-1 px-4 py-2 rounded-xl hover:text-white hover:bg-black"
					)}
					onClick={() => setIsContentEditable(false)}
				>
					<BiCheck size={18} />
					Save
				</button>
				<button
					className={cn(
						!isContentEditable && !isLoading ? "" : "hidden",
						"h-[100%] bg-slate-200 text-black flex items-center justify-center gap-1 px-4 py-2 rounded-xl hover:text-white hover:bg-black"
					)}
					onClick={() => setIsContentEditable(true)}
				>
					<BsPencil size={18} />
					Edit
				</button>
				<button
					className={cn(
						!clipboard.copied && !isLoading ? "" : "hidden",
						"h-[100%] bg-slate-200 text-black flex items-center justify-center gap-1 px-4 py-2 rounded-xl hover:text-white hover:bg-black"
					)}
					onClick={() => clipboard.copy(children)}
				>
					<BsClipboard2 size={18} />
					Copy
				</button>
				<button
					className={cn(
						clipboard.copied && !isLoading ? "" : "hidden",
						"h-[100%] text-black flex items-center justify-center gap-1 p-2"
					)}
				>
					<BsClipboard2Check size={18} />
					Copied!
				</button>
			</div>
			<TypographyP
				ref={textRef}
				className="scrollable editable-text whitespace-pre-wrap"
				contentEditable={isContentEditable}
				onInput={(event) => handleInput(event, setTimestampString)}
				{...rest}
			>
				{children}
			</TypographyP>
		</>
	);
}
