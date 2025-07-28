"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <Card className="w-full max-w-md p-6 text-center">
        <CardHeader>
          <AlertTriangle className="mx-auto h-16 w-16 text-yellow-500" />
          <CardTitle className="mt-4 text-2xl font-bold text-yellow-700">Payment Canceled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You have canceled the payment process.
          </p>
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
