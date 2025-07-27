import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth-cookies";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const token = request.cookies.get("auth-token")?.value;
    const decodedToken = await verifyToken(token);

    if (!decodedToken || !decodedToken.firebaseUid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ firebaseUid: decodedToken.firebaseUid });

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await User.find({});

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
