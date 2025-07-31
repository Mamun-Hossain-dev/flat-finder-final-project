"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentFailurePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <CardTitle className="mt-4 text-2xl font-bold text-red-700">Payment Failed</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Unfortunately, your payment could not be processed.
          </p>
          <p className="text-gray-600 mb-4">
            Please try again or contact support if the problem persists.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-base sm:text-lg h-14 sm:h-16 flex items-center justify-center"
            >
              Go to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}