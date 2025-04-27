//
// Filename: chatbot.tsx
// Description: The Gemini chatbot
// Created: 4/27/25 @ 2:59 AM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi
//

"use client";

import AIWriter from "react-aiwriter";
import { JSX, ReactNode, useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

import ChatBubble from "@/components/chat-bubble";
import ChatContainer from "@/components/chat-container";
import InputBar from "@/components/input-bar";

interface MessageData {
	content: 	ReactNode;
	isLoading: 	boolean;
}

interface ChatBotProps {
	tickers: 	string[];
	context: 	string;
}

export default function ChatBot({ tickers, context }: ChatBotProps): JSX.Element {
	const [query, setQuery] = useState<string>("");
	const [response, setResponse] = useState<string>("");
	const [messages, setMessages] = useState<MessageData[]>([]);
	const [selectedTickers, setSelectedTickers] = useState<string[]>([]);

	const divRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!divRef.current) {
			return;
		} 

		const el = divRef.current;
    	el.scrollTop = el.scrollHeight;
	}, [messages]);	

	// Post a message and wait for a response
	useEffect(() => {
		if (!query || query.length < 1) {
			return;
		}

		// Create a chat bubble for the user's query
		const userQuery = {
			content: query,
			isLoading: false
		} satisfies MessageData;

		// Create a chat bubble for the model's response
		const modelResponse = {
			content: null,
			isLoading: true
		} satisfies MessageData;

		setMessages(prev => [...prev, userQuery, modelResponse]);

		// Prompt the model for a response
		(async () => {
			const response = await fetch("/api/query", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					query: `\nTickers to focus on:\n${selectedTickers.join(", ")}
							\nAdditional Context:\n${context}Query:\n${query}`
				})
			});

			const json = await response.json();
			setResponse(json.response);
		})();
	}, [query]);

	// Update the message list with the model's response
	useEffect(() => {
		if (!response || response.length < 1) {
			return;
		}

		// The most recent message should be the loading message for the model
		const newMessages = [...messages];
		newMessages[newMessages.length - 1] = {
			content: (
				<AIWriter>
					<span className="prose">
						<Markdown>
							{response}
						</Markdown>
					</span>
				</AIWriter>
			),
			isLoading: false
		} satisfies MessageData;

		setMessages(newMessages);
	}, [response]);

	return (
		<div className="h-full w-full">
			<main className="h-full flex flex-col">
				<div ref={divRef} className="flex-grow overflow-y-auto">
					{
						messages.length > 0? (
							<ChatContainer className="pb-28 pt-10 h-full">
								{
									messages.map(({content, isLoading}, i) => (
										<ChatBubble 
											key={i}
											align={i % 2 == 0 ? "right" : "left"} 
											isLoading={isLoading} 
										>
											{content}
										</ChatBubble>
									))
								}
							</ChatContainer>
						) : (
							null // TODO: Add a placeholder message here
						)
					}
				</div>

				<InputBar className="pb-4" tickers={tickers} onSubmit={setQuery} onSelectTickers={setSelectedTickers}/>
			</main>
		</div>
	);
}
