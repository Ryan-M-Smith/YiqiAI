//
// Filename: input-block.tsx
// Description: Allow the user to input information about their chatbot
// Created: 4/26/25 @ 5:32 PM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { IoIosSend } from "react-icons/io";
import { JSX } from "react";

export default function InputBlock(): JSX.Element {
	return (
		<div className="flex flex-col gap-y-2 w-full">
			<Input placeholder="Enter your site's URL"/>
			<Textarea
				placeholder="Describe the type of chatbot you need..."
			/>
			<Button className="w-full" endContent={<IoIosSend size={25}/>}>
				Generate My Chatbot
			</Button>
		</div>
	)
}