import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Payment from '@/models/Payment';
import crypto from 'crypto';
import axios from 'axios';

export const POST = async (req: NextRequest) => {
  try {
    const { amount, type, userId, userInfo, temporaryListingId } = await req.json();
    
    // Validate required fields
    if (!amount || !type || !userId || !userInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate environment variables
    if (!process.env.SSLCOMMERZ_STORE_ID || !process.env.SSLCOMMERZ_STORE_PASSWORD) {
      console.error('Missing SSLCommerz environment variables');
      return NextResponse.json(
        { error: 'Payment service configuration error' },
        { status: 500 }
      );
    }
    
    // Generate unique transaction ID
    const tran_id = crypto.randomBytes(10).toString('hex');
    
    await dbConnect();
    
    // Create payment record
    const payment = new Payment({
      userId,
      type,
      amount,
      method: 'sslcommerz',
      reference: tran_id,
      status: 'pending'
    });
    await payment.save();

    // SSLCommerz config
    const postData = {
      store_id: process.env.SSLCOMMERZ_STORE_ID || '',
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD || '',
      total_amount: amount,
      currency: 'BDT',
      tran_id,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/success`,
      fail_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/cancel`,
      ipn_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/ipn`,
      value_a: temporaryListingId, // Pass temporaryListingId as a custom parameter
      cus_name: userInfo.name || 'Guest User',
      cus_email: userInfo.email || 'guest@example.com',
      cus_phone: userInfo.phone || '01700000000',
      cus_add1: userInfo.address || 'N/A',
      cus_city: userInfo.city || 'Dhaka',
      cus_country: 'Bangladesh',
      shipping_method: 'NO',
      product_name: `FlatFinder ${type.replace(/^\w/, (c: string) => c.toUpperCase())}`,
      product_category: 'Service',
      product_profile: 'general',
      // Add other required parameters as per SSLCommerz documentation
      // For example, value_a, value_b, value_c, value_d for custom data
    };

    const sslCommerzApiUrl = process.env.SSLCOMMERZ_IS_SANDBOX === 'true'
      ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

    console.log("Sending data to SSLCommerz:", postData);

    const response = await axios.post(sslCommerzApiUrl, new URLSearchParams(postData).toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const apiResponse = response.data;

    console.log("SSLCommerz API Response:", apiResponse);
    
    // Check if the response is successful
    if (apiResponse.status === 'SUCCESS' && apiResponse.GatewayPageURL) {
      return NextResponse.json({ gatewayURL: apiResponse.GatewayPageURL });
    } else {
      console.error('SSLCommerz initialization failed:', apiResponse);
      return NextResponse.json(
        { error: apiResponse.failedreason || 'Payment gateway initialization failed' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("Payment initialization error:", error);
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
};
