//
// Filename: page.tsx
// Route: /
// Created: 4/26/25 @ 5:14 PM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//


import { JSX } from "react";

import InputBlock from "@/components/input-block";
import Title from "@/components/title";

export default function Home(): JSX.Element {
	return (
		<div className="flex flex-col justify-center items-center h-screen min-h-screen px-4 sm:px-8 md:mx-48">
			<div className="absolute top-10 mt-10">
				<Title title="YiqiAI" subtitle="Your stocks • All the data • Powered by AI"/>
			</div>
			
			<main className="w-full flex flex-col">
				<InputBlock/>
			</main>
		</div>
	);
}
