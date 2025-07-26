// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await admin.auth().sendPasswordResetEmail(email);

    return NextResponse.json({ success: true, message: "Password reset email sent successfully." });
  } catch (error: unknown) {
    console.error("Password reset error:", error);
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ error: "User with that email does not exist." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to send password reset email." }, { status: 500 });
  }
}
