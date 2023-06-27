"use client";

import { useState } from "react";
import { TypographyP, TypographySmall } from "@/components/Typography";
import { SegmentedControl, Select, Title, createStyles } from "@mantine/core";
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
import { generateTimestamps, getTimestamps } from "@/lib/openai";
import useFragmentedState from "@/lib/useFragmentedState";
import EditableTextArea from "@/components/EditableTextArea";

const useStyles = createStyles(() => ({
	dropdownItem: {
		["&:[data-selected]"]: {
			["&:hover"]: {
				backgroundColor: "black",
			},
		},
	},
}));

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
	const {
		timestampString,
		setTimestampString,
		dispatch,
		isLoadingTimestamp,
		setIsLoadingTimestamp,
	} = useFragmentedState();

	const [urlInputContent, setUrlInputContent] = useState<string>("");

	const form = useForm({
		initialValues: {
			yt_url: "",
			qty: "normal",
		},
	});

	const { classes } = useStyles();

	function handleSubmit(values: any) {
		setIsLoadingTimestamp(true);
		setTimestampString("");

		// if (!user) {
		// 	alert("Please login or signup to continue...");
		// 	setIsLoadingTimestamp(false);
		// 	return;
		// }

		// if (!isSubscriptionActive || isSubscriptionCancelled) {
		// 	alert("Please activate your subscription to continue");
		// 	setIsLoadingTimestamp(false);
		// 	return;
		// }

		if (!validateYtUrl(values.yt_url)) {
			alert("Invalid URL");
			setIsLoadingTimestamp(false);
			return;
		}

		const vid = extractVideoId(values.yt_url);
		if (!vid) {
			alert("Invalid URL");
			setIsLoadingTimestamp(false);
			return;
		}

		// const ts =
		// 	"\n00:00:00 React Burnout and New Concepts Tutorial\n00:00:03 Challenges with Next.js and React Versions\n00:00:05 Next.js and its Importance in Web Apps\n00:00:08 Distinguishing Experimental and Stable Features\n00:00:10 Canary React and Server Actions\n00:00:12 App Router API and Performance Concerns\n00:02:13 Versaille team addressing that\n00:02:15 Performance issue head on at the moment\n00:02:17 With their new post but also developer\n00:02:19 React education at its core\n00:02:22 Innovation of React framework\n00:02:24 Massive breaking change to hooks\n00:02:25 New shift in server-client architecture\n00:02:28 Shift that brings a lot of changes\n00:02:32 Arguably worst change React ever had\n00:02:34 New server-client architecture and React server components\n00:02:36 Multi-faceted change in coding approach\n00:02:38 Using React server components not de-optimization\n00:02:41 When to use client/server components\n00:02:42 Performance benefits of server components\n00:02:44 Shift in how we code\n00:02:47 Introduction of React server components\n00:02:49 Standard and hydrated components\n00:02:51 Default of server components\n00:02:53 No need to use server components\n00:02:56 React server components bring performance benefits\n00:02:57 Introduction of react server components not for boosting sales\n00:03:00 Web easier 10 years ago\n00:03:03 Architectural problems of web apps\n00:03:05 Easier to program web 10 years ago\n00:03:07 React server components not meant for simple web apps\n00:03:10 You can use Svelte or Astro or HTML CSS in JavaScript\n00:03:12 Using tools to build your blog";
		// setTimestampString(ts);
		// setIsLoadingTimestamp(false);

		dispatch(vid, values.qty).then(() => {
			setIsLoadingTimestamp(false);
		});
	}

	return (
		<div className="min-h-[100%]">
			<Navbar />
			<main className="max-lg:min-h-[calc(10vh)] min-h-[calc(50vh)] mt-2 flex flex-col gap-8 items-center justify-end">
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
							className={cn(
								!isLoadingTimestamp ? "hidden" : "",
								"animate-spin"
							)}
						/>
						<p
							className={cn(
								isLoadingTimestamp ? "hidden" : "",
								"font-semibold text-white"
							)}
						>
							Generate Chapters
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
				<div className="p-1 w-[92%] max-w-[600px] rounded-xl">
					<Select
						size="lg"
						radius="12px"
						height={"100px"}
						allowDeselect={false}
						required={true}
						label={"How many timestamps do you want?"}
						placeholder="Pick one"
						defaultValue={"normal"}
						classNames={{ item: classes.dropdownItem }}
						styles={(theme) => ({
							item: {
								"&[data-selected]": {
									"&, &:hover": {
										backgroundColor: theme.colors.dark,
									},
								},
							},
						})}
						data={[
							{ value: "few", label: "Few" },
							{ value: "normal", label: "Normal" },
							{ value: "many", label: "Many" },
						]}
						{...form.getInputProps("qty")}
					/>
				</div>
			</div>

			{/* <div
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
			</div> */}

			<div
				className={cn(
					!urlInputContent ? "hidden" : "",
					"relative my-4 mx-auto pt-4 pb-8 px-8 grid grid-rows-[auto_1fr] gap-2 items-center justify-items-start bg-white border-[1px] border-[rgba(0,0,0,0.12)] max-w-[600px] w-[92%] rounded-xl h-fit"
				)}
			>
				<EditableTextArea
					isLoading={isLoadingTimestamp}
					setTimestampString={setTimestampString}
				>
					{timestampString}
				</EditableTextArea>
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
