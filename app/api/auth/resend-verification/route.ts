// app/api/auth/resend-verification/route.ts
import { NextRequest, NextResponse } from "next/server";
import admin from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get user by email to obtain their UID
    console.log("Attempting to get user by email:", email);
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log("User record found:", userRecord.uid);

    // Send email verification link
    await admin.auth().sendEmailVerification(userRecord.uid);
    console.log("Verification email sent for UID:", userRecord.uid);

    return NextResponse.json({ success: true, message: "Verification email sent successfully." });
  } catch (error: any) {
    console.error("Resend verification error:", error);
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json({ error: "No user found with that email." }, { status: 404 });
    } else if (error.code === 'auth/invalid-email') {
      return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to resend verification email." }, { status: 500 });
  }
}
