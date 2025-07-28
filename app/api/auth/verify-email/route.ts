// app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import TemporaryUser from "@/models/TemporaryUser"; // Import TemporaryUser model
import { setAuthCookie } from "@/lib/auth-cookies";
import admin from "@/lib/firebase-admin"; // Import firebase-admin

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { firebaseUid } = await request.json();

    // 1. Verify email status with Firebase (optional, but good for robustness)
    const firebaseUser = await admin.auth().getUser(firebaseUid);
    if (!firebaseUser.emailVerified) {
      return NextResponse.json({ error: "Email not verified by Firebase yet." }, { status: 400 });
    }

    // 2. Retrieve temporary user data
    const temporaryUser = await TemporaryUser.findOne({ firebaseUid });

    if (!temporaryUser) {
      return NextResponse.json({ error: "Temporary user data not found." }, { status: 404 });
    }

    // 3. Create full user record in MongoDB
    const newUser = new User({
      firebaseUid: temporaryUser.firebaseUid,
      email: temporaryUser.email,
      name: temporaryUser.name,
      phone: temporaryUser.phone,
      role: temporaryUser.role,
      nidNumber: temporaryUser.nidNumber,
      nidImage: temporaryUser.nidImage,
      isVerified: true, // Now verified
    });

    await newUser.save();

    // 4. Delete temporary user data
    await TemporaryUser.deleteOne({ firebaseUid });

    // 5. Set authentication cookie and redirect
    const response = NextResponse.json({ message: "Email verified successfully" });
    await setAuthCookie(response, firebaseUid);

    return NextResponse.redirect(new URL("/dashboard", request.url), { status: 302 });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
