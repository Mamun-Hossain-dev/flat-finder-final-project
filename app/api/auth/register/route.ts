// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import TemporaryUser from "@/models/TemporaryUser";
import admin from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password, name, phone, role, nidNumber, nidImage } = body;

    // 1. Create user in Firebase Authentication
    let firebaseUser;
    try {
      firebaseUser = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });

    } catch (firebaseError: any) {
      console.error("Firebase user creation error:", firebaseError);
      if (firebaseError.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: "Email already in use." }, { status: 409 });
      } else if (firebaseError.code === 'auth/invalid-password') {
        return NextResponse.json({ error: "Password should be at least 6 characters." }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to create user in Firebase." }, { status: 500 });
    }

    const firebaseUid = firebaseUser.uid;

    // 2. Store temporary user data in MongoDB
    const newTemporaryUser = new TemporaryUser({
      firebaseUid,
      email,
      name,
      phone,
      role: role || "buyer",
      nidNumber,
      nidImage,
    });

    try {
      await newTemporaryUser.save();
    } catch (mongoError: any) {
      console.error("MongoDB temporary user save error:", mongoError);
      // If MongoDB save fails, consider deleting the Firebase user to prevent orphaned accounts
      await admin.auth().deleteUser(firebaseUid);
      return NextResponse.json({ error: "Failed to save temporary user profile." }, { status: 500 });
    }

    // Return success with firebaseUid and email for client-side verification
    return NextResponse.json({ success: true, message: "User created in Firebase. Please verify your email to complete registration.", firebaseUid, email }, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
