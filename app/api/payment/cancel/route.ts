import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Payment from '@/models/Payment';

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const tran_id = formData.get('tran_id');

  if (tran_id) {
    await dbConnect();
    await Payment.updateOne(
      { reference: tran_id },
      { $set: { status: 'canceled' } }
    );
  }

  return NextResponse.redirect('/dashboard/payment/cancel');
};
