//
// Filename: route.ts
// Route: /api/query
// Created: 4/27/25 @ 12:09 AM
// Copyright (c) 2025 Ryan Smith, Adithya Kommi, Abjana Bhandari
//

import { NextResponse } from "next/server";

import generate from "@/lib/gemini-model";

export async function POST(request: Request) {
	const { query } = await request.json();
	const response = await generate(query);
	return NextResponse.json({ response: response });
}