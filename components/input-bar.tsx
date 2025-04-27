//
// Filename: input-bar.tsx
// Description: The input bar used to prompt the AI
// Created: 4/27/25 @ 3:01 AM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { IoIosSend } from "react-icons/io";
import { JSX, KeyboardEvent, useState } from "react";

interface InputBarProps {
	className?: 		string;
	tickers:  			string[];
	onSubmit: 			(value: string) => void;
	onSelectTickers: 	(tickers: string[]) => void;
}

export default function InputBar({ className, tickers, onSubmit, onSelectTickers }: InputBarProps): JSX.Element {
	const [query, setQuery] = useState<string>("");
	const [canSend, setCanSend] = useState<boolean>(false);
	const [selectedTickers, setSelectedTickers] = useState<string[]>([]);

	const sendQuery = () => {
		if (query.trim().length > 0) {
			onSubmit(query);
			setQuery("");
			setCanSend(false);
		}
	}

	const handleFormSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		sendQuery();
	};

	const toggleChip = (ticker: string) => {
		console.log(ticker);
		// Attempt to remove the ticker
		const newSelection = selectedTickers.filter(t => t !== ticker);

		// If no ticker was removed, add the one that was clicked
		if (newSelection.length === selectedTickers.length) {
			newSelection.push(ticker);
		}

		setSelectedTickers([...newSelection]);
	}

	const SendButton = () => {
		return (
			<Button
				className="relative right-0"
				color="default"
				variant="light"
				radius="full"
				size="lg"
				startContent={<IoIosSend size={30}/>}
				isDisabled={!canSend}
				onPress={sendQuery}
				isIconOnly
			/>
		);
	}

	return (
		<div className={`${className} bg-default-300 rounded-md px-3 py-2 relative`}>
			<form onSubmit={handleFormSubmit}>
				<div className="flex flex-col gap-y-1">
					<div
						className={`
							flex justify-start items-center gap-x-2 bg-default-100 rounded-full
							p-2 overflow-x-scroll overscroll-none snap-center
						`}
					>
						{
							tickers.map((ticker, i) => (
								<Chip
									className={
										`hover:cursor-pointer bg-default-200
										${selectedTickers.find(t => t === ticker)? "border-gray-300" : "" }
									`}
									key={i}
									variant="bordered"
									onClick={ () => toggleChip(ticker) }
								>
									{ticker}
								</Chip>
							))
						}
					</div>

					<div
						className="w-full shadow-lg rounded-full relative z-10"
						style={{
							animation: "shadowCycle 3s infinite linear",
						}}
					>
						<style jsx>
							{`
								@keyframes shadowCycle {
									0% {
										box-shadow: 0 4px 6px rgba(255, 0, 0, 0.5);
									}
									25% {
										box-shadow: 0 4px 6px rgba(255, 255, 0, 0.5);
									}
									50% {
										box-shadow: 0 4px 6px rgba(0, 255, 0, 0.5);
									}
									75% {
										box-shadow: 0 4px 6px rgba(0, 255, 255, 0.5);
									}
									100% {
										box-shadow: 0 4px 6px rgba(255, 0, 255, 0.5);
									}
								}
							`}
						</style>
							
						<Input
							className="w-full"
							radius="full"
							color="default"
							variant="faded"
							size="lg"
							placeholder="Enter a prompt..."
							endContent={<SendButton />}

							value={query}
							onValueChange={(value: string) => {
								setQuery(value);
								setCanSend(value.length > 0);
							}}

							onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
								if (event.key === "Enter") {
									event.preventDefault();
									onSelectTickers(selectedTickers);
									sendQuery();
								}
							}}
						/>
					</div>
				</div>
			</form>
		</div>
	);	
}