import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest) {
  const data = await req.body;

  return new Response(JSON.stringify("data"));
}
