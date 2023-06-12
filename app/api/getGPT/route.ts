import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  // organization: "org-sfL48U1zWaazJ2vvo9XQsJVu",
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  const data = await req.json();
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: data.prompt,
  });

  return NextResponse.json({ promptText: completion.data.choices[0].text });
}
