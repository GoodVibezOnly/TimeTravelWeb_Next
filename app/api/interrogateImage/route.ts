import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface ClipResponse {
  caption: string;
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const interrogateRespone = await axios.post<ClipResponse>(
    process.env.STABLE_DIFF_URL + "/sdapi/v1/interrogate",
    {
      image: data.image,
      model: "clip",
    }
  );

  return NextResponse.json({ caption: interrogateRespone.data.caption });
}
