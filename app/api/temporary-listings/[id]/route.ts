import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TemporaryListing from "@/models/TemporaryListing";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth-cookies";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const resolvedParams = await params;
    const { id } = resolvedParams;

    if (!id) {
      return NextResponse.json({ error: "Temporary listing ID is required" }, { status: 400 });
    }

    const temporaryListing = await TemporaryListing.findById(id);

    if (!temporaryListing) {
      return NextResponse.json({ error: "Temporary listing not found" }, { status: 404 });
    }

    return NextResponse.json(temporaryListing);
  } catch (error) {
    console.error("Error fetching temporary listing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
