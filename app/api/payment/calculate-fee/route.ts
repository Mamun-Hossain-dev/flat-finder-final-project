import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FlatListing from "@/models/FlatListing";

const LISTING_FEES = {
  normal_sell: 1500,
  premium_sell: 2500,
  normal_rent: 350,
  premium_rent: 600,
  bachelor_room: 250,
};

const APPOINTMENT_FEES = {
  premium_appointment: 200,
  normal_appointment: 100,
};

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { userId, type, temporaryListingId } = await request.json();

    if (!userId || !type) {
      return NextResponse.json({ error: "User ID and type are required" }, { status: 400 });
    }

    // Handle appointment fees separately
    if (type.includes("appointment")) {
      const fee = APPOINTMENT_FEES[type as keyof typeof APPOINTMENT_FEES];
      if (fee === undefined) {
        return NextResponse.json({ error: "Invalid appointment type" }, { status: 400 });
      }
      return NextResponse.json({ fee, temporaryListingId });
    }

    // Handle listing fees
    const baseFee = LISTING_FEES[type as keyof typeof LISTING_FEES];
    if (baseFee === undefined) {
      return NextResponse.json({ error: "Invalid listing type" }, { status: 400 });
    }

    const userListingsOfType = await FlatListing.countDocuments({
      ownerId: userId,
      type: type.replace("_sell", "").replace("_rent", ""), // Normalize type for counting
    });

    let calculatedFee = baseFee;

    if (type === "bachelor_room") {
      if (userListingsOfType >= 1 && userListingsOfType <= 5) {
        calculatedFee = 0; // Next 5 listings are free after the first
      }
    } else if (userListingsOfType >= 1) {
      calculatedFee = baseFee * 0.4; // 40% for subsequent listings
    }

    return NextResponse.json({ fee: calculatedFee, temporaryListingId });
  } catch (error: any) {
    console.error("Error calculating fee:", error);
    return NextResponse.json({ error: "Failed to calculate fee" }, { status: 500 });
  }
}
