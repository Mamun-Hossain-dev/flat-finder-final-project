// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth-cookies";
import admin from "@/lib/firebase-admin";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import TemporaryUser from "@/models/TemporaryUser";

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
      // If user not found by firebaseUid, try finding by email
      user = await User.findOne({ email });
      if (user) {
        // If found by email but not firebaseUid, update firebaseUid and phone
        const tempUser = await TemporaryUser.findOne({ email });
        user.firebaseUid = firebaseUid;
        user.isVerified = emailVerified; // Also update verification status
        if (tempUser && tempUser.phone) {
          user.phone = tempUser.phone;
        }
        await user.save();
      } else {
        // Create new user if not found by either
        const tempUser = await TemporaryUser.findOne({ email });
        user = await User.create({
          firebaseUid,
          email,
          name,
          phone: tempUser?.phone || "", // Use phone from tempUser or empty string
          role: tempUser?.role || "buyer", // Use role from tempUser or default to buyer
          isVerified: emailVerified,
        });
      }
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
    response = (await setAuthCookie(response, firebaseUid)) as NextResponse<{ success: boolean; user: any; }>;

    return response;
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
