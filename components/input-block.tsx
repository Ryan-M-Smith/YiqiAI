//
// Filename: input-block.tsx
// Description: Allow the user to input information about their chatbot
// Created: 4/26/25 @ 5:32 PM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

"use client";

import { AiOutlineStock } from "react-icons/ai";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { GiTalk } from "react-icons/gi";
import { JSX, useEffect, useState, Key } from "react";
import { restClient } from '@polygon.io/client-js';
import { Textarea } from "@heroui/input";

// Debounce function to delay API calls
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => clearTimeout(handler);
	}, [value, delay]);

	return debouncedValue;
}

export default function InputBlock(): JSX.Element {
	const [stocks, setStocks] = useState<string[]>([]);
	const [context, setContext] = useState<string>("")
	const [query, setQuery] = useState<string>("");
	const [autocomplete, setAutocomplete] = useState<string[]>([]);
  
  	// Debounce the query with a 500ms delay
  	const debouncedQuery = useDebounce(query, 500);

	useEffect(() => {
		if (debouncedQuery.length < 1) {
			setAutocomplete([]);
			return;
		}

		console.log("Querying API with:", debouncedQuery);

		(async () => {
			const polygonio = restClient(process.env.POLYGON_API_KEY as string);
			const response = await polygonio.reference.tickers({
				market: "stocks",
				search: debouncedQuery,
				active: "true",
				order: 	"asc",
				sort: 	"ticker",
				limit: 	10
			});

			console.log("Response: ", response);
		
			if (response.status !== "OK") {
				return;
			}

			const results = response.results;
			const data = results.map(stock => `${stock.name} (${stock.ticker})`)
			setAutocomplete([...data]);
		})();
  	}, [debouncedQuery]); // Only run effect when debouncedQuery changes

	const removeTicker = (ticker: string) => (
		setStocks(stocks.filter(stock => stock !== ticker))
	);

	const handleSelectionChange = (key: Key | null) => {
		const selectedKey = key?.toString(); // Convert Key to string if necessary
		
		if (selectedKey && !stocks.includes(selectedKey)) {
			// Extract just the ticker symbol from the selection (format: "Company Name (TICKER)")
			const tickerMatch = selectedKey.match(/\(([^)]+)\)/);
			const tickerSymbol = tickerMatch? tickerMatch[1] : selectedKey;
			
			setStocks([...stocks, tickerSymbol]);
			setQuery(""); // Clear the input after selection
			setAutocomplete([]); // Clear autocomplete results
		}
	};

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
				selectedKey=""
				isClearable
				isVirtualized
			>
				{
					autocomplete.map((stock, i) => (
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

			<Button className="w-full" onPress={ () => {} }>
				View My Personal Space 🚀
			</Button>
		</div>
	)
}