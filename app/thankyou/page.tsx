"use client";

import { FilledButton } from "@/components/Button";
import { TypographyP } from "@/components/Typography";
import { cn } from "@/lib/extra";
import { Title } from "@mantine/core";
import { useRouter } from "next/navigation";
import React from "react";
import { BsArrowLeft } from "react-icons/bs";

export default function ThankYou() {
	const router = useRouter();

	return (
		<div className="min-h-[100vh] flex flex-col items-center justify-center gap-4">
			<Title
				className={cn("text-5xl md:text-6xl font-extrabold text-center pb-4")}
			>
				Thank <span className="text-[#9333EA] pt-2">You</span>
			</Title>

			<TypographyP className="max-w-[500px] w-[80%] text-justify text-lg font-normal">
				Thank you for subscribing to{" "}
				<a
					className="text-blue-600 hover:underline underline-offset-2"
					href="https://chapterize.vercel.app"
				>
					Chapterize
				</a>
				. We truly appreciate your support and trust in our app. If you have
				queries,{" "}
				<a
					className="text-blue-600 hover:underline underline-offset-2"
					href="mailto://samyabratamaji334@gmail.com"
				>
					reachout
				</a>{" "}
				to us.{" We're grateful to have you :)"}
			</TypographyP>
			<FilledButton
				onClick={() => {
					router.push("/");
				}}
				className="mt-4 flex items-center justify-center gap-2"
			>
				<BsArrowLeft />
				Return To Chapterize
			</FilledButton>
		</div>
	);
}
