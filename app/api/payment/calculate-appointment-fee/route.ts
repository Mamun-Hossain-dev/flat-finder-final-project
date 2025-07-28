import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import FlatListing from "@/models/FlatListing";
import { verifyAuthToken } from "@/lib/auth-cookies";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const authResult = await verifyAuthToken(request);
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const firebaseUid =
      typeof authResult === "string" ? authResult : authResult.firebaseUid;

    if (!firebaseUid) {
      return NextResponse.json(
        { error: "Invalid auth token" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { userId, listingId } = await request.json();

    if (!userId || !listingId) {
      return NextResponse.json({ error: "User ID and Listing ID are required" }, { status: 400 });
    }

    // Verify that the userId from the request matches the authenticated user
    if (user._id.toString() !== userId) {
      return NextResponse.json({ error: "Forbidden: User ID mismatch" }, { status: 403 });
    }

    const listing = await FlatListing.findById(listingId);

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Define appointment fee based on listing type and premium status
    let fee = 0;
    if (listing.type === "sale") {
      fee = listing.isPremium ? 200 : 100; // Premium: 200, Normal: 100
    } else {
      // For rent and bachelor, fee is 0, handled by frontend
      return NextResponse.json({ fee: 0 });
    }

    return NextResponse.json({ fee });
  } catch (error) {
    console.error("Error calculating appointment fee:", error);
    return NextResponse.json(
      { error: "Failed to calculate appointment fee" },
      { status: 500 }
    );
  }
}
