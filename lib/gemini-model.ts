//
// Filename: gemini-model.ts
// Description: Pass queries to a Gemini 2.5 Flash model running in Google Cloud
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

import { GenerateContentConfig, GoogleGenAI, HarmBlockThreshold, HarmCategory, SafetySetting } from "@google/genai";

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || "{}");

const genAI = new GoogleGenAI({
	googleAuthOptions: { credentials: credentials },
	vertexai: true,
	project: "yiqiai",
	location: "us-central1"
});

const modelID = "gemini-2.5-flash-preview-04-17";

const context = {
	text: 	`You are an expert on the stock market. You will be told about a certain stock to talk
			about and will be an expert on that stock. Until you're told to be an expert on a new
			stock, do not answer questions about anything else except if they're related to that stock.
			Avoid putting references to sources in your answers. When you are limited to certain stocks,
			avoid talking about other stocks.`,
};
  
const modelConfig: GenerateContentConfig = {
	maxOutputTokens: 8192,
	temperature: 1,
	topP: 0.95,
	seed: 0,
	responseModalities: ["TEXT"],
	tools: [{ googleSearch: true }],

	safetySettings: [
		{
			category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
			threshold: HarmBlockThreshold.OFF,
		},

		{
			category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
			threshold: HarmBlockThreshold.OFF,
		},

		{
			category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
			threshold: HarmBlockThreshold.OFF,
		},

		{
			category: HarmCategory.HARM_CATEGORY_HARASSMENT,
			threshold: HarmBlockThreshold.OFF,
		}
	] satisfies SafetySetting[],

	systemInstruction: {
		parts: [context]
	},
};

export default async function generate(query: string) {
	const contents = {
		role: "user",
		parts: [{ text: query }]
	};
	
	const req = {
		model: modelID,
		contents: JSON.stringify(contents),
		config: modelConfig
	};
		
	const response = await genAI.models.generateContentStream(req);
	const chunks: string[] = [];

	for await (const chunk of response) {
		console.log(chunk.text);
		const text = chunk.text? chunk.text : JSON.stringify(chunk);
		const sanitizedText = text.replace(/\[\d+(?:,\s*\d+)*\]/g, "");

		chunks.push(sanitizedText);
	}

	return chunks.join("");
}
