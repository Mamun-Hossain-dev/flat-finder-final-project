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
    const status = searchParams.get("status"); // New: for filtering by status

    // Authenticate and check user role for admin-specific queries
    let isAdmin = false;
    try {
      const authResult = await verifyAuthToken(request);
      if (authResult) {
        const firebaseUid = typeof authResult === "string" ? authResult : authResult.firebaseUid;
        if (firebaseUid) {
          const user = await User.findOne({ firebaseUid });
          if (user && user.role === "admin") {
            isAdmin = true;
          }
        }
      }
    } catch (authError) {
      console.warn("Authentication failed for listings GET, proceeding as public user:", authError);
    }

    const query: any = {}; // Start with an empty query

    // Handle status filter first, as it dictates approval state for admin views
    if (status) {
      if (status === "pending") {
        query.isApproved = false;
        query.isBanned = { $ne: true };
      } else if (status === "approved") {
        query.isApproved = true;
      } else if (status === "banned") {
        query.isBanned = true;
      } else if (status === "all" && isAdmin) {
        // If status is 'all' and user is admin, do not apply isApproved/isBanned filters
        // This allows admin to see all listings regardless of approval/ban status
      }
    }

    // Handle ownerId filter
    if (ownerId) {
      console.log("GET /api/listings: Filtering by ownerId:", ownerId);
      query.ownerId = new mongoose.Types.ObjectId(ownerId);
    } else if (!status || (status !== "all" && !isAdmin)) { // Only apply public approved filter if no status is specified or not admin 'all' request
      // For public listings (no ownerId and no status filter), only show approved ones
      // Also apply if status is not 'all' or user is not admin
      query.isApproved = true;
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

    console.log("Final query object:", query); // Moved logging to show final query

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
  console.log("POST /api/listings route hit!"); // Added very early log
  await dbConnect();
  try {
    const authResult = await verifyAuthToken(request);
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract firebaseUid from the auth result (handle both string and object returns)
    const firebaseUid =
      typeof authResult === "string" ? authResult : authResult.firebaseUid;

    if (!firebaseUid) {
      return NextResponse.json(
        { error: "Invalid auth token" },
        { status: 401 }
      );
    }

    const user = await User.findOne({ firebaseUid });
    if (!user || user.role !== "seller" || !user.isVerified) {
      return NextResponse.json(
        { error: "Forbidden: Only verified sellers can create listings" },
        { status: 403 }
      );
    }

    // Check if the user has available listings
    if (user.totalListings <= 0) {
      return NextResponse.json(
        { error: "Forbidden: No available listing credits" },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Creating listing with ownerId:", user._id); // Added logging
    const newListing = await FlatListing.create({
      ...body,
      ownerId: user._id,
      isPremium: true,
      isApproved: false, // Explicitly set to false for admin approval
    });
    console.log("New listing created:", newListing); // Added logging
    console.log("New listing isApproved status (after create):", newListing.isApproved); // Added logging for isApproved after create

    // Decrement the user's totalListings count
    await User.findByIdAndUpdate(user._id, { $inc: { totalListings: -1 } });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
