import { IgetPromptRequest } from "@/helpers/interfaces";
import { getPrompt } from "@/helpers/promptTemplate";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as IgetPromptRequest;
  const year = data.year;
  const clipPrompt = data.clipPrompt;

  const prompt = getPrompt(year, clipPrompt);

  return NextResponse.json({ prompt });
}
