import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { setAuthCookie } from "@/lib/auth-cookies";
import User from "@/models/User";
import Transaction from "@/models/Transaction";

// Helper to safely create URL
const createSafeUrl = (path: string, base: string | URL | null) => {
  try {
    // Handle null or undefined base
    if (!base) {
      console.warn("Base URL is null/undefined, using fallback");
      return new URL(
        path,
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      );
    }
    return new URL(path, base);
  } catch (error) {
    console.error("Error creating URL:", error);
    return new URL(
      path,
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    );
  }
};

// Helper to validate ObjectId
const isValidObjectId = (id: string | null | undefined): boolean => {
  if (!id || id === "undefined" || id === "null") return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Map payment types to valid transaction types
const getTransactionType = (paymentType: string): string => {
  switch (paymentType) {
    case "normal_sale":
    case "premium_rent":
      return "listing_premium"; // Assuming 'listing_premium' is a valid enum value
    default:
      return "other"; // fallback to a valid enum value
  }
};

export const GET = async (request: NextRequest) => {
  console.log("Payment Success API (GET) handler entered!");
  console.log("Payment Success API (GET) hit!");

  try {
    const tran_id = request.nextUrl.searchParams.get("tran_id");
    const queryParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );
    console.log("GET Query Params:", queryParams);
    const temporaryListingId =
      queryParams.value_a || queryParams.temporaryListingId;
    console.log("Retrieved temporaryListingId (GET):", temporaryListingId);

    if (!tran_id) {
      console.error("No transaction ID provided in GET");
      return NextResponse.redirect(
        createSafeUrl("/payment/failure", request.url)
      );
    }

    await dbConnect();
    const payment = await Payment.findOne({ reference: tran_id });

    if (!payment) {
      console.error("Payment not found for transaction ID:", tran_id);
      return NextResponse.redirect(
        createSafeUrl("/payment/failure", request.url)
      );
    }

    const user = await User.findById(payment.userId);
    if (!user || !user.firebaseUid) {
      console.error(
        "User or firebaseUid not found for payment success:",
        payment.userId
      );
      return NextResponse.redirect(
        createSafeUrl("/payment/failure", request.url)
      );
    }

    // Create redirect URL safely
    const redirectPath = `/dashboard/payment/success?tran_id=${tran_id}`;
    const redirectUrl = createSafeUrl(redirectPath, request.url);

    const response = NextResponse.redirect(redirectUrl, { status: 303 });

    // Set auth cookie
    try {
      await setAuthCookie(response, user.firebaseUid);
      console.log("Auth cookie set successfully for user:", user.firebaseUid);
    } catch (cookieError) {
      console.error("Failed to set auth cookie:", cookieError);
      // Continue with redirect even if cookie setting fails
    }

    return response;
  } catch (error) {
    console.error("Error in payment success GET:", error);
    return NextResponse.redirect(
      createSafeUrl(
        "/payment/failure",
        request.url ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "http://localhost:3000"
      )
    );
  }
};

export const POST = async (request: NextRequest) => {
  console.log("Payment Success API (POST) handler entered!");
  console.log("Payment Success API (POST) hit!");

  try {
    const formData = await request.formData();
    const tran_id = formData.get("tran_id") as string;
    const formDataEntries = Object.fromEntries(formData.entries());
    console.log("POST Form Data:", formDataEntries);
    let temporaryListingId =
      (formDataEntries.value_a as string) ||
      (formDataEntries.temporaryListingId as string) ||
      request.nextUrl.searchParams.get("value_a") ||
      request.nextUrl.searchParams.get("temporaryListingId");

    // Clean up temporaryListingId - handle string "undefined" and "null"
    if (
      temporaryListingId === "undefined" ||
      temporaryListingId === "null" ||
      !temporaryListingId
    ) {
      temporaryListingId = null;
    }

    console.log("Retrieved temporaryListingId (POST):", temporaryListingId);
    console.log(
      "Is temporaryListingId valid ObjectId?",
      isValidObjectId(temporaryListingId)
    );

    if (!tran_id) {
      console.error("No transaction ID provided in POST");
      return NextResponse.redirect(
        createSafeUrl("/payment/failure", request.url)
      );
    }

    await dbConnect();
    console.log("Database connected successfully");

    const payment = await Payment.findOne({ reference: tran_id });
    console.log("Payment found:", payment ? payment._id : "Not found");

    if (!payment) {
      console.error("Payment not found for transaction ID:", tran_id);
      return NextResponse.redirect(
        createSafeUrl("/payment/failure", request.url)
      );
    }

    // Check if payment is already processed to avoid double processing
    if (payment.status === "verified") {
      console.log("Payment already verified, skipping processing");
      const user = await User.findById(payment.userId);
      if (user && user.firebaseUid) {
        const redirectPath = `/dashboard/payment/success?tran_id=${tran_id}`;
        const redirectUrl = createSafeUrl(redirectPath, request.url);
        const response = NextResponse.redirect(redirectUrl, { status: 303 });
        await setAuthCookie(response, user.firebaseUid);
        return response;
      }
    }

    // Update payment status
    payment.status = "verified";
    await payment.save();
    console.log("Payment status updated to verified");

    // If it's a listing fee, update the user's totalListings
    if (payment.type === "normal_sale" || payment.type === "premium_rent") {
      console.log(
        "Updating user totalListings for payment type:",
        payment.type
      );
      const userUpdateResult = await User.findByIdAndUpdate(
        payment.userId,
        { $inc: { totalListings: 1 } },
        { new: true }
      );
      console.log(
        "User totalListings updated:",
        userUpdateResult?.totalListings
      );
    }

    // Create a new transaction record with proper type mapping
    console.log("Creating transaction record");
    const transaction = await Transaction.create({
      userId: payment.userId,
      type: getTransactionType(payment.type), // Use mapped type
      amount: payment.amount,
      status: "completed",
      referenceId: tran_id,
      description: `Payment for ${payment.type}`,
    });
    console.log("Transaction created:", transaction._id);

    // If a temporaryListingId is present, the temporary listing should remain for admin approval.
    // The creation of a permanent FlatListing will happen in a separate admin approval endpoint.
    if (temporaryListingId && isValidObjectId(temporaryListingId)) {
      console.log(
        "Temporary listing ID received. Listing will remain in temporary collection for admin approval:",
        temporaryListingId
      );
    } else if (temporaryListingId) {
      console.warn(
        "Invalid temporaryListingId format (POST):",
        temporaryListingId
      );
    } else {
      console.warn("No temporaryListingId provided (POST)");
    }

    const user = await User.findById(payment.userId);
    if (!user || !user.firebaseUid) {
      console.error(
        "User or firebaseUid not found for payment success:",
        payment.userId
      );
      return NextResponse.redirect(
        createSafeUrl("/payment/failure", request.url)
      );
    }

    // Create redirect URL safely
    const redirectPath = `/dashboard/payment/success?tran_id=${tran_id}`;
    const redirectUrl = createSafeUrl(redirectPath, request.url);

    const response = NextResponse.redirect(redirectUrl, { status: 303 });

    // Set auth cookie
    try {
      await setAuthCookie(response, user.firebaseUid);
      console.log("Auth cookie set successfully for user:", user.firebaseUid);
    } catch (cookieError) {
      console.error("Failed to set auth cookie:", cookieError);
      // Continue with redirect even if cookie setting fails
    }

    return response;
  } catch (error: any) {
    console.error("Error in payment success POST:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.redirect(
      createSafeUrl(
        "/payment/failure",
        request.url ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "http://localhost:3000"
      )
    );
  }
};
