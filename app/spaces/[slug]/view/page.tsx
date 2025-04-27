//
// Filename: page.tsx
// Route: /spaces/[slug]/view
// Created: 4/27/25 @ 1:04 AM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

"use client";

import base64url from "base64url";
import Image from "next/image";
import { JSX, useEffect, useState, } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { restClient } from "@polygon.io/client-js";

import ChatBot from "@/components/chatbot";
import Title from "@/components/title";

export default function View(): JSX.Element {
	const params = useParams<{ slug: string }>();
	const { slug } = params; 
	
	const [tickers, setTickers] = useState<string[]>([]);
	const [context, setContext] = useState<string>("");
	const [overviews, setOverviews] = useState<{[key: string]: any}[]>([]);
	const [news, setNews] = useState<{[key: string]: any}[]>([]);
	const [upDowns, setUpDowns] = useState<{[key: string]: any}[]>([]);

	// Fetch stock overviews for the selected tickers
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
				
				// Filter to only include selected data points and format them
				const filtered: { [key: string]: any } = {};
				Object.keys(dataPoints).forEach(key => {
					const realKey = key.replace(/ /g, "");
					
					if (data[realKey]) {
						// Apply formatting function if available
						const formatter = dataPoints[key as keyof typeof dataPoints];
						filtered[key] = formatter? formatter(data[realKey]) : data[realKey];
					}
				});
				
				overviews.push(filtered);
			}

			setOverviews([...overviews]);
		})();
	}, [tickers]);

	// Fetch news related to the selected tickers
	useEffect(() => {
		if (tickers.length < 1) {
			return;
		}

		(async () => {
			const apiKey = process.env.NEXT_PUBLIC_POLYGON_API_KEY;
			const polygonio = restClient(apiKey);
			const news = [];

			for (const ticker of tickers) {
				const response = await polygonio.reference.tickerNews({
					ticker: ticker,
					order: "asc",
					limit: 1,
					sort: "published_utc"
				});

				if (response.status !== "OK") {
					return;
				}

				const [ article ] = response.results; 

				news.push({
					title: article.title,
					author: article.author,
					logo: article.publisher.favicon_url,
					url: article.article_url
				});
			}

			setNews([...news]);
		})();
	}, [tickers]);

	useEffect(() => {
		if (tickers.length < 1) {
			return;
		}

		
		(async () => {
			const apiKey = process.env.NEXT_PUBLIC_STOCKNEWSAPI_KEY;
			const upDowns = [];
			
			for (const ticker of tickers) {
				const url = `https://stocknewsapi.com/api/v1/ratings?tickers=${ticker}&items=1&page=1&token=${apiKey}`;
				const response = await fetch(url);

				if (response.status !== 200) {
					return;
				}

				const [{ data }] = await response.json();
				upDowns.push({
					"Analyst Firm": data.analyst_firm,
					"Current Rating": data.current_rating,
					"Previous Price Target": formatCurrency(data.previous_price_target)
				});
			}

			setUpDowns([...upDowns]);
			console.log(upDowns);
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
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 5,
			maximumFractionDigits: 5
		}).format(numValue);
	};

	const formatPercentage = (value: string): string => {
		// Remove % sign if present
		const cleanValue = value.replace("%", "").trim();
		const numValue = parseFloat(cleanValue) / 100;
		return new Intl.NumberFormat("en-US", {
			style: "percent",
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
					<div className="bg-default-300 rounded-lg p-2 w-[30%] flex flex-col gap-y-2 overflow-scroll overscroll-none">
						{
							overviews.map((overview, i) => (
								<div key={i} className="bg-default-100 rounded-lg p-2">
									<div className="flex flex-col gap-y-1">
										<p className="text-lg font-bold dark:text-green-300 text-green-500"> {tickers[i]} </p>

										{
											Object.entries(overview).map(([key, value], i) => (
												<p key={i} className="flex gap-x-1 text-wrap">
													<strong>{key}:</strong>
													<span>{value}</span>
												</p>
											))
										}
									</div>
								</div>
							))
						}
					</div>

					<div className="bg-default-300 rounded-lg w-[40%]">
						<ChatBot tickers={tickers} context={context}/>
					</div>

					<div className="bg-default-300 rounded-lg p-2 w-[30%] flex flex-col gap-y-2 overflow-scroll overscroll-none">
						{
							news.map(({ title, author, logo, url }, i) => (
								<div key={i} className="bg-default-100 rounded-lg p-2">
									<div className="flex flex-col gap-y-1">
										<p className="text-lg font-bold dark:text-green-300 text-green-500"> {tickers[i]} </p>
										
										<div className="flex gap-x-4 w-full">
											<div className="flex-shrink-0 flex justify-center items-center">
												<Image className="rounded-lg dark:bg-black bg-gray-300 p-1" src={logo} alt="Logo" width={40} height={20} />
											</div>

											<div className="flex flex-col gap-y-1 justify-start items-start">
												<Link className="dark:text-blue-400 text-blue-600 underline" href={url} rel="noopener noreferrer" target="_blank" passHref>
													{title}
												</Link>

												<p className="italic text-default-500 text-sm"> {author} </p>
											</div>
										</div>
									</div>
								</div>
							))
						}
					</div>
				</div>
			</main>
		</div>
	);
}