import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAuthToken } from "@/lib/auth-cookies";

export async function PUT(request: NextRequest) {
  await dbConnect();
  try {
    const authResult = await verifyAuthToken(request);
    if (!authResult || !authResult.firebaseUid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const firebaseUid = authResult.firebaseUid;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    console.log("Request body:", body); // Add this line for debugging
    // Only allow updating specific fields for security
    const updates: { [key: string]: any } = {};
    if (body.name) updates.name = body.name;
    if (body.phone) updates.phone = body.phone;
    if (body.profileImage) updates.profileImage = body.profileImage;
    if (body.nidNumber) updates.nidNumber = body.nidNumber;
    if (body.nidImage) updates.nidImage = body.nidImage;
    console.log("Updates object:", updates); // Add this line for debugging

    const updatedUser = await User.findByIdAndUpdate(user._id, updates, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 });
    }

    // Return user without sensitive data
    const userResponse = {
      _id: updatedUser._id,
      firebaseUid: updatedUser.firebaseUid,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
      nidNumber: updatedUser.nidNumber,
      nidImage: updatedUser.nidImage,
      profileImage: updatedUser.profileImage,
      warnings: updatedUser.warnings,
      isBanned: updatedUser.isBanned,
      createdAt: updatedUser.createdAt,
    };

    return NextResponse.json(userResponse);
  } catch (error: any) {
    console.error("Error updating profile:", error);
    if (error.code === 11000) {
      let field = "unknown";
      if (error.keyPattern.email) field = "email";
      else if (error.keyPattern.phone) field = "phone number";
      else if (error.keyPattern.nidNumber) field = "NID number";
      return NextResponse.json({ error: `This ${field} is already in use.` }, { status: 409 });
    } else if (error.name === "ValidationError") {
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}