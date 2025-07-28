import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Payment from '@/models/Payment';
import crypto from 'crypto';

export const POST = async (req: NextRequest) => {
  const formData = await req.formData();
  const data: Record<string, string> = {};
  formData.forEach((value, key) => data[key] = value.toString());
  
  // Validate signature
  const store_pass = process.env.SSLCOMMERZ_STORE_PASSWORD!;
  const signature = crypto
    .createHash('md5')
    .update(`${store_pass}${data.val_id}`)
    .digest('hex');

  if (signature !== data.sign_key) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  await dbConnect();
  await Payment.updateOne(
    { reference: data.tran_id },
    { $set: { status: data.status === 'VALID' ? 'verified' : 'rejected' } }
  );

  return NextResponse.json({ status: 'IPN processed' });
};
