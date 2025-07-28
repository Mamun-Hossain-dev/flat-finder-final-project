// app/api/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // This action should typically be handled client-side using Firebase client SDK
    // await admin.auth().sendPasswordResetEmail(email);

    return NextResponse.json({ success: true, message: "If an account with that email exists, a password reset link has been sent." });
  } catch (error: unknown) {
    console.error("Password reset error:", error);
    if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string') {
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json({ error: "User with that email does not exist." }, { status: 404 });
      }
    }
    return NextResponse.json({ error: "Failed to send password reset email." }, { status: 500 });
  }
}
