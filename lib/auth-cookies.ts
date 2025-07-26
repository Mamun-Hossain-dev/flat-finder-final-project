import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

export function setAuthCookie(response: NextResponse, firebaseUid: string) {
  const token = jwt.sign({ firebaseUid }, JWT_SECRET, { expiresIn: "7d" });

  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete("auth-token");
}

export function verifyAuthToken(request: NextRequest): string | null {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { firebaseUid: string };
    return decoded.firebaseUid;
  } catch {
    return null;
  }
}
