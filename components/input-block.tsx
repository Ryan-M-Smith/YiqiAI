//
// Filename: input-block.tsx
// Description: Allow the user to input information about their chatbot
// Created: 4/26/25 @ 5:32 PM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

"use client";

import { AiOutlineStock } from "react-icons/ai";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import base64url from "base64url";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { GiTalk } from "react-icons/gi";
import { JSX, useEffect, useState, Key } from "react";
import Link from "next/link";
import { Textarea } from "@heroui/input";

export default function InputBlock(): JSX.Element {
	const [slug, setSlug] = useState<string>("");
	const [stocks, setStocks] = useState<string[]>([]);
	const [context, setContext] = useState<string>("")
	const [query, setQuery] = useState<string>("");
	const [autocomplete, setAutocomplete] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (query.length < 1) {
			return;
		}

		(async () => {
			setIsLoading(true);

			const response = await fetch(`
				https://financialmodelingprep.com/stable/search-name?
				query=${query}&apikey=${process.env.NEXT_PUBLIC_FMP_API_KEY}
			`);
		
			if (response.status !== 200) {
				return;
			}

			const symbols = await response.json();

			if (symbols.length < 1) {
				return;
			}

			const data = symbols.map((stock: any) => `${stock.name} (${stock.symbol})`)
			setAutocomplete([...data]);
			setIsLoading(false);
		})();
  	}, [query]); // Only run effect when debouncedQuery changes

	const removeTicker = (ticker: string) => (
		setStocks(stocks.filter(stock => stock !== ticker))
	);

	const handleSelectionChange = (key: Key | null) => {
		const selectedKey = key?.toString(); // Convert Key to string if necessary
		
		if (!selectedKey) {
			return;
		}

		// Extract just the ticker symbol from the selection (format: "Company Name (TICKER)")
		const tickerMatch = selectedKey.match(/\(([^)]+)\)/);
		const tickerSymbol = tickerMatch ? tickerMatch[1] : selectedKey;

		if (!stocks.includes(tickerSymbol)) {
			setStocks([...stocks, tickerSymbol]);
			setQuery(""); // Clear the input after selection
			setAutocomplete([]); // Clear autocomplete results
		}
	};

	const buildSlug = () => {
		const data = {
			tickers: stocks,
			context: context
		};

		const json = JSON.stringify(data);
		const encoded = base64url.encode(json);

		setSlug(encoded);
	}

	const StartContent = () => {
		return stocks.length > 0? (
			<div className="flex gap-x-2">
				{
					stocks.map((ticker, i) => (
						<Chip key={i} color="success" onClose={ () => removeTicker(ticker) }>
							{ticker}
						</Chip>
					))
				}
			</div>
		) : (
			<AiOutlineStock/>
		)
	}

	return (
		<div className="flex flex-col gap-y-2 w-full">
			<Autocomplete
				aria-label="autocomplete"
				radius="lg"
				startContent={<StartContent/>}
				placeholder="Enter a company or ticker name"
				menuTrigger="input"
				onInputChange={setQuery}
				onSelectionChange={handleSelectionChange}
				inputValue={query}
				isLoading={isLoading}
				isClearable
				isVirtualized
			>
				{
					autocomplete.map((stock) => (
						<AutocompleteItem key={stock} textValue={stock}>
							{stock}
						</AutocompleteItem>
					))
				}
			</Autocomplete>

			<Textarea
				startContent={<GiTalk/>}
				placeholder="Describe the type of chatbot you need..."
				onValueChange={setContext}
			/>

			<Link href={`/spaces/${slug}/view`}>
				<Button className="w-full" onPress={buildSlug}>
					View My Personal Space 🚀
				</Button>
			</Link>
		</div>
	)
}