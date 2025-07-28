import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
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

    const adminUser = await User.findOne({ firebaseUid: decodedToken.firebaseUid });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const { id } = resolvedParams;
    const { cardType } = await request.json(); // 'yellow' or 'red'

    if (!cardType || !["yellow", "red"].includes(cardType)) {
      return NextResponse.json({ error: "Invalid card type provided" }, { status: 400 });
    }

    const userToUpdate = await User.findById(id);

    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add the card to the warnings array
    userToUpdate.warnings.push({ type: cardType, timestamp: new Date() });

    // Implement auto-ban logic if needed (e.g., after 2 yellow cards)
    const yellowCards = (userToUpdate.warnings as { type: string }[]).filter(w => w.type === 'yellow').length;
    if (yellowCards >= 2) {
      userToUpdate.isBanned = true;
    }

    await userToUpdate.save();

    return NextResponse.json({ message: `Card ${cardType} assigned to user`, user: userToUpdate });
  } catch (error) {
    console.error("Error assigning card:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
