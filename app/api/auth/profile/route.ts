// app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firebaseUid, name, phone, nidNumber, nidImage, profileImage } =
      body;

    // Find and update user
    const updatedUser = await User.findOneAndUpdate(
      { firebaseUid },
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(nidNumber && { nidNumber }),
        ...(nidImage && { nidImage }),
        ...(profileImage && { profileImage }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return updated user without sensitive data
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
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
