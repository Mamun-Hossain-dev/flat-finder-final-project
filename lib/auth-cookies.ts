import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret");

export async function setAuthCookie(response: NextResponse, firebaseUid: string): Promise<NextResponse> {
  const token = await new jose.SignJWT({ firebaseUid })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);

  response.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: "/",
  });
  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete("auth-token");
}

export async function verifyAuthToken(request: NextRequest): Promise<jose.JWTPayload | null> {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    console.log("No auth-token found in cookies.");
    return null;
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    console.log("Auth token successfully verified. Decoded payload:", payload);
    return payload;
  } catch (error) {
    console.error("Auth token verification failed:", error);
    return null;
  }
}

export async function verifyToken(token: string | undefined): Promise<jose.JWTPayload | null> {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}