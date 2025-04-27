//
// Filename: page.tsx
// Route: /spaces/[slug]/view
// Created: 4/27/25 @ 1:04 AM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

"use client";

import base64url from "base64url";
import { JSX, useEffect, useState, } from "react";
import { notFound, useParams } from "next/navigation";

import ChatBot from "@/components/chatbot";
import Title from "@/components/title";

export default function View(): JSX.Element {
	const params = useParams<{ slug: string }>();
	const { slug } = params; 
	
	const [tickers, setTickers] = useState<string[]>([]);
	const [context, setContext] = useState<string>("")
	
	// Decode the slug and parse it as JSON
	useEffect(() => {
		if (!slug) {
			notFound();
		}

		try {
			const json = JSON.parse(base64url.decode(slug));
			const { tickers, context } = json;

			setTickers(tickers);
			setContext(context);
		}
		catch (error) {
			console.error(`Error decoding slug: ${error}`);
			notFound();
		}
	}, [slug]);

	return (
		<div className="flex flex-col justify-center items-center h-screen max-h-screen px-4 sm:px-8 md:mx-20">
			<main className="flex flex-col gap-y-2 w-full h-screen my-10">
				<div>
					<Title title="YiqiAI Spaces" subtitle=""/>
				</div>

				<div className="flex gap-x-2 w-full h-[700px]">
					<div className="bg-default-300 rounded-lg w-[20%]">

					</div>

					<div className="bg-default-300 rounded-lg w-[40%]">
						<ChatBot tickers={tickers} context={context}/>
					</div>

					<div className="bg-default-300 rounded-lg w-[40%]">
						<p>Text</p>
					</div>
				</div>
			</main>
		</div>
	);
}