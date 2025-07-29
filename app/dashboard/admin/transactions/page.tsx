"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Transaction {
  _id: string;
  buyerId: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  listingId: {
    _id: string;
    title: string;
    images: string[];
    location: { area: string; city: string };
    price: number;
    type: string;
  };
  amount: number;
  bookingType: 'premium' | 'normal';
  status: 'pending' | 'completed' | 'cancelled';
  paymentReferenceId?: string;
  bookedAt: string;
}

export default function AdminTransactionsPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/transactions', {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1]}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading) {
      if (!userProfile || userProfile.role !== 'admin') {
        router.push('/dashboard'); // Redirect if not admin
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to view this page.',
          variant: 'destructive',
        });
      } else {
        fetchTransactions();
      }
    }
  }, [userProfile, authLoading, router, toast, fetchTransactions]);

  

  const handleStatusChange = async (transactionId: string, newStatus: 'pending' | 'completed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/admin/transactions/${transactionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update status');
      }

      toast({
        title: 'Success',
        description: 'Transaction status updated.',
      });
      fetchTransactions(); // Re-fetch to update UI
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Transactions</h1>

      {transactions.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No transactions found.
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Listing</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Booked At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell className="font-medium">{transaction._id.slice(-6)}</TableCell>
                    <TableCell>
                      <p>{transaction.buyerId.name}</p>
                      <p className="text-sm text-gray-500">{transaction.buyerId.email}</p>
                    </TableCell>
                    <TableCell>
                      <Link href={`/listings/${transaction.listingId._id}`} className="text-blue-600 hover:underline">
                        {transaction.listingId.title}
                      </Link>
                    </TableCell>
                    <TableCell>৳{transaction.amount.toLocaleString()}</TableCell>
                    <TableCell>{transaction.bookingType}</TableCell>
                    <TableCell>
                      <Select
                        value={transaction.status}
                        onValueChange={(newStatus: 'pending' | 'completed' | 'cancelled') =>
                          handleStatusChange(transaction._id, newStatus)
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>{new Date(transaction.bookedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listings/${transaction.listingId._id}`}>View Listing</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}