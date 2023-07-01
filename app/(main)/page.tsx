"use client";

import { useState } from "react";
import { TypographyP, TypographySmall } from "@/components/Typography";
import {
	SegmentedControl,
	Select,
	Title,
	createStyles,
	rem,
} from "@mantine/core";
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

	async function cancelSubscription(subscriptionId: string) {
		const response = await fetch(
			`https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionId}`,
			{
				method: "PATCH",
				headers: {
					Accept: "application/vnd.api+json",
					"Content-Type": "application/vnd.api+json",
					Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
				},
				body: JSON.stringify({
					data: {
						type: "subscriptions",
						id: subscriptionId,
						attributes: {
							cancelled: true,
						},
					},
				}),
			}
		);
	}

	function handleSubmit(values: any) {
		setIsLoadingTimestamp(true);
		setTimestampString("");

		if (!user) {
			alert("Please login or signup to continue...");
			setIsLoadingTimestamp(false);
			return;
		}

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
			<main className="mt-24 flex flex-col gap-4 items-center justify-end">
				<div className="flex flex-col my-4 items-center justify-center w-[100%]">
					{/* <TypographySmall className="text-[#8997aa]">
					{"Try for free (No credit card required)"}
				</TypographySmall> */}
					{/* <div className="flex items-center justify-items-center"> */}
					{/* <img src={IcTikTok.src} /> */}
					<img src={IcYouTube.src} className="h-9 w-auto" />
					{/* <img src={IcInstagram.src} /> */}
					{/* </div> */}
				</div>
				<header className="px-[8%] pb-[2%]">
					<Title
						className={cn(
							"text-5xl md:text-6xl font-[700] font-display text-4xl text-center pb-4"
						)}
					>
						YouTube Chapters in{" "}
						<span className="text-[#9333EA] pt-2">1 Click</span>
					</Title>
					<TypographyP className="text-center text-xl font-light">
						Increase Watch Time and Rank in search!
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

				<div
					className={cn(
						!urlInputContent ? "hidden" : "",
						"my-4 flex items-center justify-center"
					)}
				>
					<div className="w-[100%] rounded-xl">
						<Select
							size="lg"
							radius="12px"
							height={"100px"}
							w={"600px"}
							width={"600px"}
							allowDeselect={false}
							required={true}
							label={"How many timestamps do you want?"}
							placeholder="How many timestamps do you want?"
							defaultValue={undefined}
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
								{ value: "few", label: "Minimal", desc: "Generates around 3-5 chapters for a 10 minute video" },
								{ value: "normal", label: "Basic", desc: "Generates around 5-10 chapters for a 10 minute video" },
								{ value: "many", label: "Too Many", desc: "Generates around 10+ chapters for a 10 minute video" },
							]}
							itemComponent={({ label, desc }) => (
								<div className="p-4">
									<h2 className="text-xl">{label}</h2>
									<p>{desc}</p>
								</div>
							)}
							{...form.getInputProps("qty")}

							// classNames={classes}
							// onChange={(event) => {
							// 	form.getInputProps("qty").onChange(event);
							// 	if (event) return setTitleDropdown(event);
							// }}
							// onFocus={() => setDropdownFocused(true)}
							// onBlur={() => setDropdownFocused(false)}
						/>
					</div>
				</div>

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
				<div className="mt-4 mb-24 flex items-center justify-center gap-2 bg-[#e2e8f0] px-4 rounded-xl">
					<TypographyP className="text-sm font-normal">Powered By</TypographyP>
					<img src={IcOpenai.src} className="h-[1rem] text-sm" />
				</div>
			</main>

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
		</div>
	);
}
