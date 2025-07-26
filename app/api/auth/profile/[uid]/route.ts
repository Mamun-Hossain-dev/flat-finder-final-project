// app/api/auth/profile/[uid]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

interface Params {
  uid: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { uid: string } }
) {
  try {
    await dbConnect();

    const { uid } = params;
    console.log("Fetching profile for UID:", uid);

    const user = await User.findOne({ firebaseUid: uid });
    console.log("MongoDB user found:", user);

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
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
