import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth-cookies'; // Assuming you have a verifyToken utility

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);
    if (!decodedToken || !decodedToken.firebaseUid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findOne({ firebaseUid: decodedToken.firebaseUid });

    if (!user) {
      console.log("User not found for firebaseUid:", decodedToken.firebaseUid);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    console.log("Fetching bookings for buyerId:", user._id);
    const bookings = await Booking.find({ buyerId: user._id })
      .populate('listingId', 'title images location price type') // Populate relevant listing details
      .sort({ bookedAt: -1 });
    console.log("Found bookings:", bookings.length);
    console.log("Bookings data:", JSON.stringify(bookings, null, 2));

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
