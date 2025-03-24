import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  res.setHeader(
    "Set-Cookie",
    serialize("TOKENAUTH", token, {
      httpOnly: true, // Prevent access from JavaScript
      secure: process.env.NODE_ENV === "production", // Secure in HTTPS
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })
  );
  
  res.status(200).json({ message: "Cookie set!" });
}

export const saveToken = async (token: string) => {
  localStorage.setItem("TOKENAUTH", token);
  await fetch("/api/set-cookie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
};
