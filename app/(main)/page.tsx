"use client";

import { useState } from "react";
import { TypographyP, TypographySmall } from "@/components/Typography";
import { BsClipboard2, BsClipboard2Check } from "react-icons/bs";
import { SegmentedControl, Title } from "@mantine/core";
import { BiLoaderAlt } from "react-icons/bi";
import {
	cn,
	extractVideoId,
	parseRawTimestamp,
	timestampArrayToString,
	validateYtUrl,
} from "@/lib/extra";
import { useClipboard } from "@mantine/hooks";
import { useForm } from "@mantine/form";

import IcOpenai from "@/assets/icons/ic_openai.svg";
import IcTikTok from "@/assets/icons/ic_tiktok.svg";
import IcYouTube from "@/assets/icons/ic_youtube.svg";
import IcInstagram from "@/assets/icons/ic_instagram.svg";

import { useAuth } from "@/firebase/AuthProvider";
import Navbar from "@/components/Navbar";
import { useLicenseInfo } from "@/firebase/LicenseProvider";

// let timerId: NodeJS.Timeout;
// async function queuedFetch(
// 	input: RequestInfo | URL,
// 	init?: RequestInit,
// 	callback?: CallableFunction,
// 	debounceInterval = 2000
// ): Promise<any> {
// 	clearTimeout(timerId);

// 	timerId = setTimeout(() => {
// 		if (callback) callback();
// 	}, debounceInterval);

// 	return await fetch(input, init);
// }

export default function PageMain() {
	const { user } = useAuth();
	const { isSubscriptionActive, isSubscriptionCancelled } = useLicenseInfo();

	const clipboard = useClipboard();
	const [urlInputContent, setUrlInputContent] = useState<string>("");
	const [timestampInfo, setTimestampInfo] = useState<string>("Loading...");
	const [isGenerating, setIsGenerating] = useState<boolean>(false);

	const form = useForm({
		initialValues: {
			yt_url: "",
			qty: "normal",
		},
	});

	function handleSubmit(values: any) {
		setIsGenerating(true);
		setTimeout(() => {
			setIsGenerating(false);
		}, 5000);

		if (!user) {
			alert("Please login or signup to continue...");
			setIsGenerating(false);
			return;
		}

		if (!isSubscriptionActive || isSubscriptionCancelled) {
			alert("Please activate your subscription to continue");
			setIsGenerating(false);
			return;
		}

		if (!validateYtUrl(values.yt_url)) {
			alert("Invalid URL");
			setIsGenerating(false);
			return;
		}

		const vid = extractVideoId(values.yt_url);
		if (!vid) {
			alert("Invalid URL");
			setIsGenerating(false);
			return;
		}
		const timestampApiUrl = `${
			process.env.NEXT_PUBLIC_TIMESTAMP_API_URL as string
		}/${vid}?key=${process.env.NEXT_PUBLIC_OPEN_AI_API_KEY}&qty=${
			values.qty
		}&model=gpt-3.5-turbo`;

		fetch(timestampApiUrl, {
			method: "GET",
			keepalive: true,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Credentials": "true",
				"Access-Control-Allow-Headers": "*",
				"Access-Control-Allow-Methods": "*"
			},
		})
			.then((response) => {
				if (response.ok) {
					return response.json();
				}
			})
			.then((data) => {
				setTimestampInfo(
					timestampArrayToString(parseRawTimestamp(data.content))
				);
				setIsGenerating(false);
				console.log(data.content);
			});
	}

	return (
		<div className="min-h-[100%]">
			<Navbar />
			<main className="min-h-[calc(50vh)] mt-2 flex flex-col gap-8 items-center justify-end">
				<div className="flex items-center justify-center gap-2 bg-[#e2e8f0] px-4 rounded-xl">
					<TypographyP>Powered By</TypographyP>
					<img src={IcOpenai.src} className="h-[1.25rem]" />
				</div>

				<header className="px-[8%]">
					<Title className="font-semibold text-center pb-2">
						Make Timestamps With{" "}
						<span className="text-[#9333EA] pt-2">One Click</span>
					</Title>
					<TypographyP className="text-center">
						Generate timestamps for YouTube videos
					</TypographyP>
				</header>

				<form
					onSubmit={form.onSubmit((values) => {
						handleSubmit(values);
					})}
					className="smooth-shadow p-2 border-[1px] border-[rgba(0,0,0,0.12)] bg-white rounded-xl max-w-[600px] w-[92%] grid grid-cols-[1fr_auto] max-sm:grid-rows-2 max-sm:grid-cols-1"
				>
					<input
						className="h-[48px] outline-none px-4"
						placeholder="Paste any YouTube URL"
						{...form.getInputProps("yt_url")}
						onChange={(event) => {
							setUrlInputContent(event.target.value);
							form.getInputProps("yt_url").onChange(event);
						}}
					/>
					<button className="bg-black h-[48px] px-8 rounded-xl" type="submit">
						<BiLoaderAlt
							color="white"
							size={24}
							className={cn(!isGenerating ? "hidden" : "", "animate-spin")}
						/>
						<p
							className={cn(
								isGenerating ? "hidden" : "",
								"font-semibold text-white"
							)}
						>
							Generate
						</p>
					</button>
				</form>
			</main>

			<div
				className={cn(
					!urlInputContent ? "hidden" : "",
					"my-4 flex items-center justify-center"
				)}
			>
				<div className="p-1 bg-white w-[92%] max-w-[600px] border-[1px] border-[rgba(0,0,0,0.12)] rounded-xl">
					<SegmentedControl
						w="100%"
						h={"100%"}
						radius="md"
						bg="white"
						color="dark"
						size="md"
						data={[
							{ label: "Few", value: "few" },
							{ label: "Normal", value: "normal" },
							{ label: "Many", value: "many" },
						]}
						{...form.getInputProps("qty")}
					/>
				</div>
			</div>

			<div
				className={cn(
					!urlInputContent ? "hidden" : "",
					"relative my-4 mx-auto pt-4 pb-8 px-8 grid grid-rows-[auto_1fr] gap-2 items-center justify-items-start bg-white border-[1px] border-[rgba(0,0,0,0.12)] max-w-[600px] w-[92%] rounded-xl h-fit"
				)}
			>
				<div className="w-[100%] h-[42px] flex items-center justify-end">
					{!clipboard.copied ? (
						<button
							className="h-[100%] text-black flex items-center justify-center gap-1 px-4 py-2 rounded-xl hover:text-white hover:bg-black"
							onClick={() => clipboard.copy(timestampInfo)}
						>
							<BsClipboard2 size={18} />
							Copy
						</button>
					) : (
						<button className="h-[100%] text-black flex items-center justify-center gap-1 p-2">
							<BsClipboard2Check size={18} />
							Copied!
						</button>
					)}
				</div>
				<TypographyP className="whitespace-pre-wrap">
					{timestampInfo}
				</TypographyP>
			</div>

			<div className="flex flex-col items-center justify-center mt-4 mb-24 gap-8">
				<TypographySmall className="text-[#8997aa]">
					{"Try for free (No credit card required)"}
				</TypographySmall>
				<div className="grid grid-cols-[128px_128px_128px] max-sm:grid-rows-[48px_48px_48px] max-sm:grid-cols-[128px] gap-4 items-center justify-items-center">
					<img src={IcTikTok.src} />
					<img src={IcYouTube.src} />
					<img src={IcInstagram.src} />
				</div>
			</div>
		</div>
	);
}
