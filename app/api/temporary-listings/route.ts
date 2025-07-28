import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import TemporaryListing from "@/models/TemporaryListing";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth-cookies";
import { verifyAuthToken } from "@/lib/auth-cookies";

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

    const temporaryListings = await TemporaryListing.find({});

    return NextResponse.json(temporaryListings);
  } catch (error) {
    console.error("Error fetching temporary listings:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log("POST /api/temporary-listings route hit!");
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
    if (!user || user.role !== "seller" || !user.isVerified) {
      return NextResponse.json(
        { error: "Forbidden: Only verified sellers can create listings" },
        { status: 403 }
      );
    }

    if (user.totalListings <= 0) {
      return NextResponse.json(
        { error: "Forbidden: No available listing credits" },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("Creating temporary listing with ownerId:", user._id);
    const newTemporaryListing = await TemporaryListing.create({
      ...body,
      ownerId: user._id,
      // Temporary listings do not have isApproved or isPremium fields initially
    });
    console.log("New temporary listing created:", newTemporaryListing);

    await User.findByIdAndUpdate(user._id, { $inc: { totalListings: -1 } });

    return NextResponse.json(newTemporaryListing, { status: 201 });
  } catch (error) {
    console.error("Error creating temporary listing:", error);
    return NextResponse.json(
      { error: "Failed to create temporary listing" },
      { status: 500 }
    );
  }
}
