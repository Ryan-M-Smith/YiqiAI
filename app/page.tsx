//
// Filename: page.tsx
// Route: /
// Created: 4/26/25 @ 5:14 PM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//


import { JSX } from "react";

import GenCodeBlock from "@/components/gen-code-block";
import InputBlock from "@/components/input-block";
import Title from "@/components/title";

export default function Home(): JSX.Element {
	return (
		<div className="flex flex-col justify-center items-center h-screen min-h-screen px-4 sm:px-8 md:mx-48">
			<div className="absolute top-10">
				<Title/>
			</div>
			
			<main className="w-full flex flex-col">
				<div className="flex flex-col w-full gap-y-2 h-full">
					<InputBlock/>

					{/* <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-2 w-full h-auto md:h-[500px]">
						<div className="h-full">
							<GenCodeBlock/>
						</div>

						<div className="bg-default-50 w-full rounded-md">
							Filler
						</div>
					</div> */}
				</div>
			</main>
		</div>
	);
}
