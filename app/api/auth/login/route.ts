// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth-cookies";
import admin from "@/lib/firebase-admin";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is missing" },
        { status: 400 }
      );
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;
    const email = decodedToken.email;
    const name = decodedToken.name || email; // Use email as name if not provided by Firebase
    const emailVerified = decodedToken.email_verified;

    if (!emailVerified) {
      return NextResponse.json({ error: "Email not verified. Please verify your email to log in." }, { status: 403 });
    }

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // Create new user if not found
      user = await User.create({
        firebaseUid,
        email,
        name,
        phone: "", // Placeholder, should be collected during registration or profile completion
        role: "buyer", // Default role
        isVerified: emailVerified,
      });
    } else {
      // Update user's email verification status if it changed in Firebase
      if (user.isVerified !== emailVerified) {
        user.isVerified = emailVerified;
        await user.save();
      }
    }

    let response = NextResponse.json({
      success: true,
      user: user.toObject(),
    });
    response = await setAuthCookie(response, firebaseUid);

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login error:", error);
    if (
      error.code === "auth/argument-error" ||
      error.code === "auth/id-token-expired" ||
      error.code === "auth/invalid-id-token"
    ) {
      return NextResponse.json(
        { error: "Invalid or expired ID token" },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
