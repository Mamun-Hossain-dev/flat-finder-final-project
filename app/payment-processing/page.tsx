"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function PaymentProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tran_id = searchParams.get('tran_id');
  console.log("PaymentProcessingPage - tran_id:", tran_id);

  useEffect(() => {
    if (tran_id) {
      // Redirect to the actual success page after a short delay
      // This gives the browser time to process the cookie
      const timer = setTimeout(() => {
        router.replace(`/dashboard/payment/success?tran_id=${tran_id}`);
      }, 1000); // 1 second delay

      return () => clearTimeout(timer);
    } else {
      router.replace('/payment/failure');
    }
  }, [tran_id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <Loader2 className="mx-auto h-16 w-16 text-blue-500 animate-spin" />
          <CardTitle className="mt-4 text-2xl font-bold text-gray-700">Processing Payment...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Please wait while we confirm your payment and redirect you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
