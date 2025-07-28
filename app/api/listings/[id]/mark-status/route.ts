import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FlatListing from "@/models/FlatListing";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth-cookies";

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
    const { status } = await request.json(); // 'sold' or 'rented'

    if (!status || !["sold", "rented"].includes(status)) {
      return NextResponse.json({ error: "Invalid status provided" }, { status: 400 });
    }

    const listing = await FlatListing.findByIdAndUpdate(
      id,
      { available: false, type: status }, // Mark as unavailable and update type
      { new: true }
    );

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Listing marked as ${status}`, listing });
  } catch (error) {
    console.error("Error marking listing status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
