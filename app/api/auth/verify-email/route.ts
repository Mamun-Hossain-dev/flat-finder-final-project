// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { setAuthCookie } from "@/lib/auth-cookies";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { firebaseUid } = await request.json();

    const user = await User.findOneAndUpdate(
      { firebaseUid },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Set authentication cookie
    const response = NextResponse.json({ message: "Email verified successfully" });
    await setAuthCookie(response, firebaseUid);

    // Redirect to dashboard or home page
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
