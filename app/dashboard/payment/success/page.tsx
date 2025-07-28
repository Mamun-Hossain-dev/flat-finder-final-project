"use client";

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const tran_id = searchParams.get('tran_id');

  useEffect(() => {
    // You might want to do a final verification on the backend here
    // using the tran_id to ensure payment integrity.
    // For now, we rely on the /api/payment/success route to update status.
  }, [tran_id]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <CardTitle className="mt-4 text-2xl font-bold text-green-700">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Your payment was processed successfully.
          </p>
          {tran_id && (
            <p className="text-sm text-gray-500 mb-4">
              Transaction ID: <span className="font-semibold">{tran_id}</span>
            </p>
          )}
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
