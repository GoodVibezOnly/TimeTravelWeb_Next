import { NextRequest, NextResponse } from "next/server";

function getNegativePrompt(year: number, gptPrompt: string) {
  let promptText = "";
  let olderPhotoNegativePrompt =
    " ,colors, color photography, color film, colours, colorful, colorized, color photo, red, green, blue, yellow, orange, purple, pink, brown, black, rainbow,";
  let newerPhotoNegativePrompt =
    " ,lack and white, black and white photography, sepia, monochrome,";

  if (gptPrompt != "" && gptPrompt != null && gptPrompt != "No") {
    promptText = gptPrompt;
  }
  if (year <= 1950) {
    promptText += olderPhotoNegativePrompt;
  } else {
    promptText += newerPhotoNegativePrompt;
  }

  return promptText; // Return the prompt text
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const year = data.year;
  const gptPrompt = data.gptPrompt;
  const negativePromptText = getNegativePrompt(year, gptPrompt);
  return NextResponse.json({ negativePromptText });
}
