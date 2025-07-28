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
            <Button variant="destructive">Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}