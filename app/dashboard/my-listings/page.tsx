"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Home, Bed, Bath, Ruler, DollarSign, Tag, Edit, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Listing {
  _id: string;
  title: string;
  description: string;
  images: string[];
  type: "sale" | "rent" | "bachelor";
  location: { area: string; city: string };
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  isPremium: boolean;
  ownerId: string; // Only ID needed here
  views: number;
  available: boolean;
  isApproved: boolean;
}

export default function MyListingsPage() {
  const { toast } = useToast();
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyListings = async () => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/listings?ownerId=${userProfile._id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch your listings");
      }
      const data = await response.json();
      console.log("My Listings API Response:", data);
      setListings(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to load your listings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && userProfile && userProfile.role === "seller") {
      fetchMyListings();
    }
  }, [userProfile, authLoading]);

  const handleDelete = async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete listing");
      }

      toast({
        title: "Success!",
        description: "Listing deleted successfully.",
      });
      fetchMyListings(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== "seller") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>Access Denied: Only sellers can view their listings.</p>
      </div>
    );
  }

  if (loading) {
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
    <ProtectedRoute requiredRole="seller">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Listings</h1>
          <Link href="/dashboard/add-listing">
            <Button>Add New Listing</Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            You haven't created any listings yet.
            <p className="mt-2"><Link href="/dashboard/add-listing" className="text-blue-600 hover:underline">Add a new listing</Link></p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing._id} className="overflow-hidden shadow-lg">
                <div className="relative w-full h-48">
                  <Image
                    src={listing.images[0] || "/placeholder.jpg"}
                    alt={listing.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {listing.isPremium && (
                    <span className="absolute top-2 left-2 rounded-md bg-yellow-500 px-2 py-1 text-xs font-medium text-white">
                      Premium
                    </span>
                  )}
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-2">{listing.title}</CardTitle>
                  <p className="text-gray-600 text-sm mb-2">{listing.location.area}, {listing.location.city}</p>
                  <div className="flex items-center justify-between text-gray-700 text-lg font-bold mb-3">
                    <span className="flex items-center"><DollarSign className="w-4 h-4 mr-1" />{listing.price.toLocaleString()}</span>
                    <span className="flex items-center"><Tag className="w-4 h-4 mr-1" />{listing.type}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600 text-sm">
                    <span className="flex items-center"><Bed className="w-4 h-4 mr-1" />{listing.bedrooms} Beds</span>
                    <span className="flex items-center"><Bath className="w-4 h-4 mr-1" />{listing.bathrooms} Baths</span>
                    <span className="flex items-center"><Ruler className="w-4 h-4 mr-1" />{listing.size} sqft</span>
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                    <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                      <Link href={`/dashboard/edit-listing/${listing._id}`}>
                        <Edit className="w-4 h-4 mr-2" />Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                          <Trash2 className="w-4 h-4 mr-2" />Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            listing and remove its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(listing._id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
