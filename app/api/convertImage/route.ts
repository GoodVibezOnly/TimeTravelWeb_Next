import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface ConvertResponse {
  images: Array<{ url: string }>;
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const prompt = data.prompt;
  const input_image = data.image;

  const convertResponse = await axios.post<ConvertResponse>(
    process.env.STABLE_DIFF_URL + "/sdapi/v1/txt2img",
    {
      prompt: prompt,
      negatives:
        "painting, render, distorted face, Overexposed, render, lowquality, deformed bodys, text, distorted face, picture frame, oversaturated, overexposed, underexposed, painting, distorted, writing, border, multiple images, blurry, watermark, unrealistic, lowresolution, lowquality, lowcontrast, pixelated, noisy, unnatural, artefact, moiré, motion blur, compression artefacts",
      steps: 35,
      height: 512,
      width: 512,
      sampler_index: "Euler a",
      restoreFaces: "true",
      alwayson_scripts: {
        controlnet: {
          args: [
            {
              input_image: input_image,
              module: "canny",
              model: "control_v11p_sd15_canny [d14c016b]",
              weight: 0.7,
              lowvram: false,
              // "guessmode": false,
            },
          ],
        },
      },
    }
  );
  return NextResponse.json({ images: convertResponse.data.images });
}
