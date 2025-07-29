import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Booking from '@/models/Booking';
import { verifyToken } from '@/lib/auth-cookies';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  await dbConnect();
  
  try {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) {
      console.log('No auth-token found in cookies');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await verifyToken(token);
    if (!decodedToken || !decodedToken.firebaseUid) {
      console.log('Token verification failed or no firebaseUid');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fix: Use firebaseUid instead of userId to find the user
    const user = await User.findOne({ firebaseUid: decodedToken.firebaseUid });
    if (!user) {
      console.log('User not found with firebaseUid:', decodedToken.firebaseUid);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.role !== 'admin') {
      console.log('User is not admin. Role:', user.role);
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const transactions = await Booking.find()
      .populate('buyerId', 'name email phone')
      .populate('listingId', 'title images location price type')
      .sort({ bookedAt: -1 });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
