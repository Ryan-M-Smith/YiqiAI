//
// Filename: page.tsx
// Description: The website title
// Created: 4/26/25 @ 8:18 PM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

"use client";

import { gsap }	from "gsap";
import { JSX, useEffect, useRef } from "react";

export default function Title(): JSX.Element {
	const titleRef = useRef<HTMLHeadingElement>(null);
	const subtitleRef = useRef<HTMLHeadingElement>(null);
	

	useEffect(() => {
		if (!titleRef.current) {
			return;
		}

		gsap.to(titleRef.current, {
			backgroundPosition: "200% 0%",
			repeat: -1, 						// Loop forever
			duration: 5, 						// Duration for 1 full cycle
			ease: "sine.inOut",					// Smooth easing
			yoyo: true, 						// Reverse direction after each cycle
		});
	}, []);

	useEffect(() => {
		if (!subtitleRef.current) {
			return;
		}

		const text = subtitleRef.current.innerText;
		subtitleRef.current.innerText = "";

		// Split text into an array of letters and create text nodes
		const letters = text.split("").map((letter) => {
			const span = document.createElement("span");
			span.innerText = letter;
			return span;
		});

		// Append each letter as a span element to the title
		letters.forEach((span) => subtitleRef.current?.appendChild(span));

		// Use GSAP to animate each letter
		gsap.fromTo(
			letters,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 0.1,
				stagger: 0.05, 		// Delay between each letter
				ease: "power1.out", // Smooth ease for the effect
			}
		);
	}, []);

	return (
		<div>
			<h1
				ref={titleRef}
				className="text-7xl font-extrabold text-center mt-10"
				style={{
					background: "linear-gradient(90deg, #6ee7b7, #9333ea, #f472b6)",
					backgroundSize: "200% 100%", // Gradient stretched across
					backgroundPosition: "0% 0%", // Starting position of the gradient
					color: "transparent", // Text color transparent so the gradient shows
					backgroundClip: "text", // Clipping the background to the text
					WebkitBackgroundClip: "text", // For Safari
				}}
			>
				YiqiAI
			</h1>

			<h2
				ref={subtitleRef}
				className="text-3xl font-extrabold text-center mt-10 text-default-700"
				style={{
					whiteSpace: "nowrap", // Keep the text in one line
					overflow: "hidden", // Hide anything that overflows
				}}
			>
				Your stocks. All the data. Powered by AI.
			</h2>
		</div>
	);
}