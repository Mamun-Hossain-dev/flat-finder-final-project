import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FlatListing from "@/models/FlatListing";
import { verifyAuthToken } from "@/lib/auth-cookies";
import User from "@/models/User";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const listing = await FlatListing.findById(id).populate(
      "ownerId",
      "name email phone"
    );

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Increment view count
    listing.views = (listing.views || 0) + 1;
    await listing.save();

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const firebaseUid = await verifyAuthToken(request);
    if (!firebaseUid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const listing = await FlatListing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check if user is owner or admin
    if (
      listing.ownerId.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this listing or are not an admin" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updatedListing = await FlatListing.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const { id } = await params;
    const firebaseUid = await verifyAuthToken(request);
    if (!firebaseUid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const listing = await FlatListing.findById(id);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Check if user is owner or admin
    if (
      listing.ownerId.toString() !== user._id.toString() &&
      user.role !== "admin"
    ) {
      return NextResponse.json(
        { error: "Forbidden: You do not own this listing or are not an admin" },
        { status: 403 }
      );
    }

    await FlatListing.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Listing deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}
