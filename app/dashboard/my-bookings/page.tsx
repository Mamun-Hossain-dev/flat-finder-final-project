"use client";

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';

interface Booking {
  _id: string;
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
  bookedAt: string;
}

export default function MyBookingsPage() {
  const { currentUser, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMyBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('; ').find(row => row.startsWith('auth-token='))?.split('=')[1]}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data);
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
    if (!authLoading && currentUser) {
      fetchMyBookings();
    } else if (!authLoading && !currentUser) {
      setError('Please log in to view your bookings.');
      setLoading(false);
    }
  }, [currentUser, authLoading, fetchMyBookings]);

  

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
    <div className="container mx-auto py-24">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {loading ? (
        <div className="text-center text-gray-500 text-lg">
          Loading bookings...
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          You have no bookings yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <Card key={booking._id} className="overflow-hidden shadow-lg">
              <Link href={`/listings/${booking.listingId._id}`}>
                <div className="relative w-full h-48">
                  <Image
                    src={booking.listingId.images[0] || '/placeholder.jpg'}
                    alt={booking.listingId.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="rounded-t-lg"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <CardTitle className="text-xl font-semibold mb-2">
                  <Link href={`/listings/${booking.listingId._id}`}>
                    {booking.listingId.title}
                  </Link>
                </CardTitle>
                <p className="text-gray-600 text-sm mb-2">
                  {booking.listingId.location.area}, {booking.listingId.location.city}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-bold text-blue-600">৳{booking.amount.toLocaleString()}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">
                  Booked on: {new Date(booking.bookedAt).toLocaleDateString()}
                </p>
                <p className="text-gray-500 text-xs">
                  Type: {booking.bookingType.charAt(0).toUpperCase() + booking.bookingType.slice(1)}
                </p>
                <div className="mt-4">
                  <Link href={`/listings/${booking.listingId._id}`}>
                    <Button variant="outline" className="w-full">View Listing</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
