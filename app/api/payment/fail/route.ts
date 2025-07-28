import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  return NextResponse.redirect(new URL('/dashboard/payment/failure', request.url));
}