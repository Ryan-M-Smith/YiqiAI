//
// Filename: chat-bubble.tsx
// Description: A chat bubble
// Created: 4/27/25 @ 2:55 AM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

import { JSX, ReactNode } from "react";
import { Spinner } from "@heroui/spinner";
import { TbTriangleInvertedFilled } from "react-icons/tb";

interface ChatBubbleProps {
	className?: string;
	children?: 	ReactNode;
	align?: 	"left" | "right";
	isLoading?: boolean;
}

export default function ChatBubble({ className, children, align, isLoading }: ChatBubbleProps): JSX.Element {
	const justify = align === "left"? "justify-start" : "justify-end";
	const items = align === "left"? "items-start" : "items-end";
	const side = align === "left"? "-left-[1.5]" : "right-0";
	
	return (
		<div className={`${className} ${justify} flex w-full px-2 sm:px-4 my-1`}>
			<div className={`${items} flex flex-col relative max-w-[85%] sm:max-w-[75%]`}>
				{ /* Bubble */ }
				<div className="rounded-lg bg-default-100 px-3 sm:px-5 py-2 w-full break-words whitespace-normal overflow-hidden">
					{
						isLoading? (
							<Spinner
								className="flex justify-center items-center"
								label="YiqiAI is thinking..."
								color="success"
								variant="wave"
							/>
						) : children
					}
				</div>

				{ /* Tail */}
				<TbTriangleInvertedFilled
					className={`relative top-[-13px] ${side} text-default-100 rotate-[3deg]`}
					size={30}
				/>
			</div>
		</div>
	);
}