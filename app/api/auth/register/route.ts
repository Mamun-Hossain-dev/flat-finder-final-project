// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TemporaryUser from "@/models/TemporaryUser";
import admin from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    console.log("Register API: Request received.");
    const body = await request.json();
    console.log("Register API: Request body parsed.", body);
    const { email, password, name, phone, role, nidNumber, nidImage } = body;

    // 1. Check if user already exists in Firebase Authentication
    try {
      await admin.auth().getUserByEmail(email);
      // If user exists in Firebase, they should log in, not register again
      return NextResponse.json({ error: "Email already registered in Firebase. Please log in." }, { status: 409 });
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') {
        console.error("Firebase getUserByEmail error:", error);
        return NextResponse.json({ error: "Failed to check Firebase user existence." }, { status: 500 });
      }
      // User not found in Firebase, proceed with registration
    }

    // 2. Check if temporary user with this email already exists in MongoDB
    const existingTemporaryUser = await TemporaryUser.findOne({ email });
    if (existingTemporaryUser) {
      // If temporary user exists but no Firebase user (checked above), it's an orphaned entry.
      // Delete it to allow a fresh registration.
      console.warn("Found orphaned TemporaryUser entry, deleting it.");
      await TemporaryUser.deleteOne({ email });
    }

    // 3. Create user in Firebase Authentication
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
      await admin.auth().deleteUser(firebaseUid);

      if (mongoError.code === 11000) {
        // Duplicate key error (unique constraint violation)
        let field = "unknown";
        if (mongoError.keyPattern.email) field = "email";
        else if (mongoError.keyPattern.phone) field = "phone number";
        else if (mongoError.keyPattern.nidNumber) field = "NID number";
        return NextResponse.json({ error: `This ${field} is already in use.` }, { status: 409 });
      } else if (mongoError.name === "ValidationError") {
        // Mongoose validation error (e.g., required field missing)
        const errors = Object.keys(mongoError.errors).map(key => mongoError.errors[key].message);
        return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
      }
      return NextResponse.json({ error: "Failed to save temporary user profile." }, { status: 500 });
    }

    // Return success with firebaseUid and email for client-side verification
    return NextResponse.json({ success: true, message: "User created in Firebase. Please verify your email to complete registration.", firebaseUid, email }, { status: 201 });
  } catch (error: unknown) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
