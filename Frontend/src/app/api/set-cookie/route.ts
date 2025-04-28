import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json(
      { message: "Token is required" },
      { status: 400 }
    );
  }

  const response = NextResponse.json(
    { message: "Cookie set!" },
    { status: 200 }
  );

  response.headers.set(
    "Set-Cookie",
    serialize("TOKENAUTH", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    })
  );

  return response;
}
