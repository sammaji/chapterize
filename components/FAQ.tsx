"use client";

import { TypographyA } from "@/components/Typography";
import { Accordion } from "@mantine/core";
import React from "react";
import { BiPlus } from "react-icons/bi";

export default function FAQ() {
	return (
		<div className="flex min-w-[100vh] max-w-[600px] items-center justify-center flex-col">
			<Accordion
				w={"600px"}
				chevron={<BiPlus size="1rem" />}
				styles={{
					chevron: {
						"&[data-rotate]": {
							transform: "rotate(45deg)",
						},
					},
				}}
			>
				{/* <Accordion.Item value="hello-world">
					<Accordion.Control>How can I reset my password?</Accordion.Control>
					<Accordion.Panel>
						How can I reset my password? How can I reset my password? How can I
						reset my password? How can I reset my password? How can I reset my
						password? How can I reset my password? How can I reset my password?
						How can I reset my password?
					</Accordion.Panel>
				</Accordion.Item> */}

				<Accordion.Item value="hello-world1">
					<Accordion.Control>
						Is there a limit to the video length that I provide?
					</Accordion.Control>
					<Accordion.Panel>
						Currently <TypographyA>Chapterize</TypographyA> generates the best
						results if your video length is somewhere between 1 minute to 4
						hours.
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value="hello-world2">
					<Accordion.Control>
						Are the chapters compatible with YouTube format?
					</Accordion.Control>
					<Accordion.Panel>
						By default the Chapters are in a format that YouTube supports. So
						you can directly copy and paste them in your video description.
					</Accordion.Panel>
				</Accordion.Item>

				<Accordion.Item value="hello-world3">
					<Accordion.Control>Do I get a free trial?</Accordion.Control>
					<Accordion.Panel>
						You can generate YouTube Chapters for upto 5 videos for free. No
						credit cards required.
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</div>
	);
}
