import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyAuthToken } from "@/lib/auth-cookies";

export async function PUT(request: NextRequest) {
  await dbConnect();
  try {
    const firebaseUid = await verifyAuthToken(request);
    if (!firebaseUid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    // Only allow updating specific fields for security
    const updates: { [key: string]: any } = {};
    if (body.name) updates.name = body.name;
    if (body.phone) updates.phone = body.phone;
    if (body.profileImage) updates.profileImage = body.profileImage;
    // Add other fields that can be updated by the user

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
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}