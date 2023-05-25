import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface ClipResponse {
  caption: string;
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const interrogateRespone = await axios.post<ClipResponse>(
    "http://127.0.0.1:7860/sdapi/v1/interrogate",
    {
      image: data.image,
      model: "clip",
    }
  );

  return NextResponse.json({ caption: interrogateRespone.data.caption });
}
