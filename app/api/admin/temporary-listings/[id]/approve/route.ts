import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TemporaryListing from "@/models/TemporaryListing";
import FlatListing from "@/models/FlatListing";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth-cookies";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Await the params promise
    const resolvedParams = await params;
    const id = resolvedParams.id; // Explicitly cast params to any

    if (!id) {
      return NextResponse.json({ error: "Temporary listing ID is required" }, { status: 400 });
    }

    const temporaryListing = await TemporaryListing.findById(id);

    if (!temporaryListing) {
      return NextResponse.json({ error: "Temporary listing not found" }, { status: 404 });
    }

    // Create the permanent listing from the temporary one
    const { ...listingData } = temporaryListing.toObject();

    const permanentListing = await FlatListing.create({
      ...listingData,
      isApproved: true, // Set to true upon admin approval
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Delete the temporary listing
    await TemporaryListing.findByIdAndDelete(id);

    return NextResponse.json({ message: "Listing approved and moved to permanent listings", listing: permanentListing });
  } catch (error) {
    console.error("Error approving temporary listing:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
