import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FlatListing from "@/models/FlatListing";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth-cookies"; // Assuming you have a verifyToken utility

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    const { status } = await request.json();

    if (!status || !["approved", "banned", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid status provided" }, { status: 400 });
    }

    const listing = await FlatListing.findByIdAndUpdate(
      id,
      { isApproved: status === "approved", isBanned: status === "banned" },
      { new: true }
    );

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Listing status updated to ${status}`, listing });
  } catch (error) {
    console.error("Error updating listing status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
