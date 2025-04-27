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
	const [context, setContext] = useState<string>("");
	const [overviews, setOverviews] = useState<{[key: string]: any}[]>([]);

	useEffect(() => {
		if (tickers.length < 1) {
			return;
		}

		(async () => {
			const apiKey = process.env.NEXT_PUBLIC_ALPHAVANTAGE_API_KEY;
			const overviews = [];
			const dataPoints = {
				"Market Capitalization": formatCurrency,
				"EPS": formatCurrency,
				"PE Ratio": null,
				"Forward PE": null,
				"Dividend Yield": formatPercentage,
				"Revenue TTM": formatCurrency,
				"Profit Margin": formatPercentage,
				"Analyst Target Price": formatCurrency,
				"Beta": null,
				"Quarterly Earnings Growth YOY": formatPercentage
			};
		
			for (const ticker of tickers) {
				const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`;

				const response = await fetch(url);
				const data = await response.json();

				console.log("Data:", data);
				
				// Filter to only include selected data points and format them
				const filtered: { [key: string]: any } = {};
				Object.keys(dataPoints).forEach(key => {
					const realKey = key.replace(/ /g, "");
					
					if (data[realKey]) {
						// Apply formatting function if available
						const formatter = dataPoints[key as keyof typeof dataPoints];
						filtered[key] = formatter ? formatter(data[realKey]) : data[key];
					}
				});
				
				overviews.push(filtered);
			}

			setOverviews([...overviews]);
			console.log("Overviews:", overviews);
		})();
	}, [tickers]);
	
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

	// Format functions for consistent data display
	const formatCurrency = (value: string | number): string => {
		const numValue = typeof value === "string" ? parseFloat(value) : value;
		return new Intl.NumberFormat('en-US', {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 5,
			maximumFractionDigits: 5
		}).format(numValue);
	};

	const formatPercentage = (value: string): string => {
		// Remove % sign if present
		const cleanValue = value.replace('%', '').trim();
		const numValue = parseFloat(cleanValue) / 100;
		return new Intl.NumberFormat('en-US', {
			style: 'percent',
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(numValue);
	};

	return (
		<div className="flex flex-col justify-center items-center h-screen max-h-screen px-4 sm:px-8 md:mx-20">
			<main className="flex flex-col gap-y-2 w-full h-screen my-10">
				<div>
					<Title title="YiqiAI Spaces"/>
				</div>

				<div className="flex gap-x-2 w-full h-[700px]">
					<div className="bg-default-300 rounded-lg p-2 w-[30%] flex flex-col gap-y-2">
						{
							overviews.map((overview, i) => (
								<div key={i} className="bg-default-100 rounded-lg p-2">
									{
										Object.entries(overview).map(([key, value], i) => (
											<div className="flex flex-col gap-y-1" key={i}>
												<p className="text-lg font-bold text-green-300"> {tickers[i]} </p>
												<p className="flex gap-x-1 text-wrap">
													<strong>{key}:</strong>
													<span>{value}</span>
												</p>
											</div>
										))
									}
								</div>
							))
						}
					</div>

					<div className="bg-default-300 rounded-lg w-[40%]">
						<ChatBot tickers={tickers} context={context}/>
					</div>

					<div className="bg-default-300 rounded-lg w-[30%]">
						<p>Text</p>
					</div>
				</div>
			</main>
		</div>
	);
}