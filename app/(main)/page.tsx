"use client";

import { useState } from "react";
import { TypographyP, TypographySmall } from "@/components/Typography";
import {
	Select,
	Title,
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

import { useAuth } from "@/firebase/AuthProvider";
import Navbar from "@/components/Navbar";
import { useLicenseInfo } from "@/firebase/LicenseProvider";
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

	function handleSubmit(values: any) {
		setIsLoadingTimestamp(true);
		setTimestampString("");

		if (!user) {
			alert("Please login or signup to continue...");
			setIsLoadingTimestamp(false);
			return;
		}

		console.log(isSubscriptionActive, isSubscriptionCancelled)

		if (!isSubscriptionActive || isSubscriptionCancelled) {
			alert("Please activate your subscription to continue");
			setIsLoadingTimestamp(false);
			return;
		}

		// if (!validateYtUrl(values.yt_url)) {
		// 	alert("Invalid URL");
		// 	setIsLoadingTimestamp(false);
		// 	return;
		// }

		const vid = extractVideoId(values.yt_url);
		if (!vid) {
			alert("Invalid URL");
			setIsLoadingTimestamp(false);
			return;
		}

		dispatch(vid, values.qty).then(() => {
			setIsLoadingTimestamp(false);
		});
	}

	return (
		<div className="min-h-[100%]">
			<Navbar />
			<main className="mt-16 flex flex-col gap-4 items-center justify-end">
				<div className="flex flex-col my-4 items-center justify-center w-[100%]">
					{/* <TypographySmall className="text-[#8997aa]">
					{"Try for free (No credit card required)"}
				</TypographySmall> */}
					{/* <div className="flex items-center justify-items-center"> */}
					{/* <img src={IcTikTok.src} /> */}
					{/* <img src={IcYouTube.src} className="h-6 w-auto" /> */}
					{/* <img src={IcInstagram.src} /> */}
					{/* </div> */}
				</div>
				<header className="px-[8%] pb-[2%]">
					<Title
						className={cn(
							"text-5xl md:text-6xl font-extrabold text-center pb-4"
						)}
					>
						YouTube Chapters in{" "}
						<span className="text-[#9333EA] pt-2">One Click</span>
					</Title>
					<TypographyP className="text-center text-slate-700 text-lg font-normal">
						Effortlessly generate precise YouTube Chapters and{" "}
						<b>increase your watch time and rank in search</b>.
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
							className={"font-semibold text-white"}
							hidden={isLoadingTimestamp}
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
								{
									value: "few",
									label: "Minimal",
									desc: "Generates around 3-5 chapters for a 10 minute video",
								},
								{
									value: "normal",
									label: "Basic",
									desc: "Generates around 5-10 chapters for a 10 minute video",
								},
								{
									value: "many",
									label: "Too Many",
									desc: "Generates around 10+ chapters for a 10 minute video",
								},
							]}
							itemComponent={({ value, label, desc }) => (
								<div
									className="p-4 hover:bg-slate-100"
									onClick={() => form.setValues({ qty: value })}
								>
									<h2 className="text-xl">{label}</h2>
									<p>{desc}</p>
								</div>
							)}
							{...form.getInputProps("qty")}
						/>
					</div>
				</div>

				<div
					hidden={!urlInputContent}
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
		</div>
	);
}
