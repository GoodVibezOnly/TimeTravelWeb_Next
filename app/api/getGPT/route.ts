import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";

interface PromptResponse {
  year: string;
  promptText: string;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { year, promptText } = data;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens: 10,
    messages: [
      {
        role: ChatCompletionRequestMessageRoleEnum.System,
        content: "Please list any of the following items that did not exist in " + year + ": '" + promptText + " ' Separate multiple items with a comma. If all items existed, respond with 'No'",
      },
    ],
    temperature: 0,
  });

  return NextResponse.json({ promptText: completion.data.choices[0].message?.content });
}
