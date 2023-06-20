import { NextRequest, NextResponse } from "next/server";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessageRoleEnum,
} from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  const data = await req.json();
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: 10,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: "What is 2+2",
      },
    ],
    temperature: 0,
  });

  return NextResponse.json({ promptText: completion.data.choices[0].message?.content });
}
