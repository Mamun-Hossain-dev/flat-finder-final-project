import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import FlatListing from "@/models/FlatListing";
import { verifyAuthToken } from "@/lib/auth-cookies";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const city = searchParams.get("city");
    const area = searchParams.get("area");
    const maxPrice = searchParams.get("maxPrice");
    const isPremium = searchParams.get("isPremium");
    const featured = searchParams.get("featured"); // New: for featured listings
    const limit = searchParams.get("limit"); // New: for limiting results
    const ownerId = searchParams.get("ownerId"); // New: for filtering by owner

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {}; // Start with an empty query

    if (ownerId) {
      console.log("GET /api/listings: Filtering by ownerId:", ownerId);
      query.ownerId = new mongoose.Types.ObjectId(ownerId);
    } else {
      // For public listings, show all for now (temporarily removing isApproved filter)
      // In production, you'd likely keep query.isApproved = true;
    }

    if (type) {
      query.type = type;
    }
    if (city) {
      query["location.city"] = city;
    }
    if (area) {
      query["location.area"] = area;
    }
    if (maxPrice) {
      query.price = { $lte: parseFloat(maxPrice) };
    }
    if (isPremium === "true" || featured === "true") {
      query.isPremium = true;
    }

    let listingsQuery = FlatListing.find(query).populate(
      "ownerId",
      "name email phone"
    );

    if (limit) {
      listingsQuery = listingsQuery.limit(parseInt(limit));
    }

    const listings = await listingsQuery.exec();
    console.log("GET /api/listings: Found listings:", listings.length);
    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const firebaseUid = await verifyAuthToken(request);
    if (!firebaseUid) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user || user.role !== "seller" || !user.isVerified) {
      return NextResponse.json(
        { error: "Forbidden: Only verified sellers can create listings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Creating listing with ownerId:", user._id); // Added logging
    const newListing = await FlatListing.create({
      ...body,
      ownerId: user._id,
      isPremium: true,
    });
    console.log("New listing created:", newListing); // Added logging
    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
