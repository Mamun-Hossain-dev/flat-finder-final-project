import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth-cookies";

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  return response;
}
