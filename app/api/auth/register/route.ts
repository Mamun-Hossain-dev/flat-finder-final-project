// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
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

      // Optionally send email verification
      // await admin.auth().sendEmailVerification(firebaseUser.uid);

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

    // 2. Check if user already exists in MongoDB (should ideally not happen if Firebase creation was successful)
    const existingUser = await User.findOne({ $or: [{ email }, { firebaseUid }] });

    if (existingUser) {
      // If user somehow exists in MongoDB but not Firebase (or vice-versa), handle inconsistency
      // For now, return error, but in production, you might want to link them or clean up.
      return NextResponse.json({ error: "User already exists in database." }, { status: 409 });
    }

    // 3. Create new user in MongoDB
    const newUser = new User({
      firebaseUid,
      email,
      name,
      phone,
      role: role || "buyer",
      nidNumber,
      nidImage,
      isVerified: false, // Email verification will be handled by Firebase and updated on login
    });

    try {
      await newUser.save();
    } catch (mongoError: any) {
      console.error("MongoDB user save error:", mongoError);
      // If MongoDB save fails, consider deleting the Firebase user to prevent orphaned accounts
      await admin.auth().deleteUser(firebaseUid);
      return NextResponse.json({ error: "Failed to save user profile." }, { status: 500 });
    }

    // Return user without sensitive data
    const userResponse = {
      _id: newUser._id,
      firebaseUid: newUser.firebaseUid,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role,
      isVerified: newUser.isVerified,
      nidNumber: newUser.nidNumber,
      nidImage: newUser.nidImage,
      profileImage: newUser.profileImage,
      warnings: newUser.warnings,
      isBanned: newUser.isBanned,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(userResponse, { status: 201 });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
