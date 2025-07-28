"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Bed, Bath, Ruler, DollarSign, Tag } from "lucide-react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface TemporaryListing {
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
  ownerId: { name: string; email: string; phone: string };
}

export default function TemporaryListingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<TemporaryListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/temporary-listings/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch temporary listing");
          }
          const data = await response.json();
          setListing(data);
        } catch (err: any) {
          setError(err.message);
          toast({
            title: "Error",
            description: err.message || "Failed to load listing details.",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      };
      fetchListing();
    }
  }, [id, toast]);

  const handleApprove = async () => {
    if (!listing) return;
    try {
      const response = await fetch(`/api/admin/temporary-listings/${listing._id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve listing");
      }

      toast({
        title: "Success",
        description: "Listing approved and moved to permanent listings.",
      });
      router.push("/dashboard/admin/listings"); // Redirect back to admin listings
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to approve listing.",
        variant: "destructive",
      });
    }
  };

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

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <p>Listing not found.</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="container mx-auto py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Temporary Listing Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">{listing.title}</h2>
                <p className="text-gray-600 mb-4">{listing.location.area}, {listing.location.city}</p>

                <div className="flex items-center justify-between text-gray-700 text-xl font-bold mb-4">
                  <span className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-1" />
                    {listing.price.toLocaleString()} BDT
                  </span>
                  <span className="flex items-center">
                    <Tag className="w-5 h-5 mr-1" />
                    {listing.type}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{listing.description}</p>

                <div className="grid grid-cols-3 gap-4 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <Bed className="w-5 h-5 mr-2" />
                    <span>{listing.bedrooms} Beds</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="w-5 h-5 mr-2" />
                    <span>{listing.bathrooms} Baths</span>
                  </div>
                  <div className="flex items-center">
                    <Ruler className="w-5 h-5 mr-2" />
                    <span>{listing.size} sqft</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold mb-2">Owner Details</h3>
                <p>Name: {listing.ownerId?.name}</p>
                <p>Email: {listing.ownerId?.email}</p>
                <p>Phone: {listing.ownerId?.phone}</p>

                <div className="mt-6 flex space-x-4">
                  <Button onClick={handleApprove} className="bg-green-500 hover:bg-green-600 text-white">
                    Approve Listing
                  </Button>
                  <Button variant="outline" onClick={() => router.back()}>
                    Back to Listings
                  </Button>
                </div>
              </div>

              <div>
                <div className="grid grid-cols-1 gap-4">
                  {listing.images.map((image, index) => (
                    <div key={index} className="relative w-full h-64 rounded-md overflow-hidden">
                      <Image
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-md"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
