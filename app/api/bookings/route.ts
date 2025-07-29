import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import FlatListing from '@/models/FlatListing';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { buyerId, listingId, amount, bookingType, paymentReferenceId } = await req.json();

    if (!buyerId || !listingId || !amount || !bookingType) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Optional: Verify buyerId and listingId exist
    const buyerExists = await User.findById(buyerId);
    const listingExists = await FlatListing.findById(listingId);

    if (!buyerExists || !listingExists) {
      return NextResponse.json({ message: 'Buyer or Listing not found' }, { status: 404 });
    }

    const newBooking = new Booking({
      buyerId,
      listingId,
      amount,
      bookingType,
      paymentReferenceId,
      status: 'pending',
    });

    await newBooking.save();

    return NextResponse.json({ message: 'Booking created successfully', booking: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
