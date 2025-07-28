import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Complaint from "@/models/Complaint";
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
    const { status } = await request.json();

    if (!status || !["pending", "reviewed", "resolved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status provided" }, { status: 400 });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!complaint) {
      return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
    }

    return NextResponse.json({ message: `Complaint status updated to ${status}`, complaint });
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
