import { NextRequest, NextResponse } from "next/server";

function getNegativePrompt(year: number, gptPrompt: string) {
  let promptText = "";
  let olderPhotoNegativePrompt =
    " ,colors, color photography, color film, colours, colorful, colorized,";
  let newerPhotoNegativePrompt =
    " ,black and white, black and white photography, sepia, monochrome,";

  if (gptPrompt != "" && gptPrompt != null && gptPrompt != "No") {
    promptText = gptPrompt;
  }
  if (year <= 1950) {
    promptText += olderPhotoNegativePrompt;
  } else {
    promptText += newerPhotoNegativePrompt;
  }

  return (
    promptText +
    +"painting, render, overexposed, distorted face, Overexposed, render, lowquality, deformed bodys, text, distorted face, picture frame, oversaturated, distorted, writing, border, multiple images, blurry, watermark, unrealistic, lowresolution, lowquality, lowcontrast, pixelated, unnatural, artefact, moiré, motion blur, compression artefacts"
  );
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const year = data.year;
  const gptPrompt = data.gptPrompt;
  const negativePromptText = getNegativePrompt(year, gptPrompt);
  return NextResponse.json({ negativePromptText });
}
