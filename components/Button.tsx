import { cn } from "@/lib/extra";
import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function OutlinedButton(props: ButtonProps) {
	const { className, disabled, children, ...rest } = props;
	return (
		<button
			className={cn(
				"text-black flex items-center justify-center gap-1 bg-transparent h-[36px] px-4 text-sm rounded-xl",
				!disabled ? "hover:bg-slate-200" : "cursor-pointer",
				className || ""
			)}
			{...rest}
		>
			{children}
		</button>
	);
}

export function FilledButton(props: ButtonProps) {
	const { className, children, ...rest } = props;

	return (
		<button
			className={`bg-black text-white h-[36px] px-4 text-sm rounded-xl ${className}`}
			{...rest}
		>
			{children}
		</button>
	);
}
