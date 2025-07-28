import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(request: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  await dbConnect();
  try {
    const { uid } = await params;
    const user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return user without sensitive data
    const userResponse = {
      _id: user._id,
      firebaseUid: user.firebaseUid,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      nidNumber: user.nidNumber,
      nidImage: user.nidImage,
      profileImage: user.profileImage,
      warnings: user.warnings,
      isBanned: user.isBanned,
      createdAt: user.createdAt,
    };

    return NextResponse.json(userResponse);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}