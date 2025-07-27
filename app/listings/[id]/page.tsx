"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Home, Bed, Bath, Ruler, DollarSign, Tag, Eye } from "lucide-react";

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
  ownerId: { name: string; email: string; phone: string };
  views: number;
  available: boolean;
  isApproved: boolean;
}

const ListingDetailsPage = memo(() => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Handle array params
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchListing = useCallback(async () => {
    if (!id) {
      setError("No listing ID provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/listings/${id}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `HTTP ${response.status}: Failed to fetch listing`
        );
      }

      const data = await response.json();

      // Validate the response data
      if (!data || typeof data !== "object") {
        throw new Error("Invalid listing data received");
      }

      setListing(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load listing details";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const handleBookAppointment = useCallback(() => {
    // Add your booking logic here
    toast({
      title: "Booking Request",
      description: "Your appointment request has been sent to the owner.",
    });
  }, [toast]);

  const handleContactLandlord = useCallback(() => {
    // Add your contact logic here
    if (listing?.ownerId?.email) {
      window.location.href = `mailto:${listing.ownerId.email}`;
    }
  }, [listing]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <div className="text-red-500 mb-4">
          <p className="text-xl font-semibold">Error Loading Listing</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={fetchListing} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
        <p className="text-xl text-gray-600 mb-4">Listing not found.</p>
        <Button onClick={() => window.history.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-3xl font-bold">
              {listing.title}
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              {listing.location?.area}, {listing.location?.city}
            </CardDescription>
            {listing.isPremium && (
              <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 w-fit">
                Premium Listing
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image Carousel */}
          {listing.images && listing.images.length > 0 && (
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {listing.images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative w-full h-96">
                        <Image
                          src={image}
                          alt={`${listing.title} - Image ${index + 1}`}
                          fill
                          className="rounded-lg object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          priority={index === 0}
                          onError={(e) => {
                            // Handle broken images
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-image.jpg"; // Add a placeholder image
                          }}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {listing.images.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            </div>
          )}

          {/* Details and Description Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Details Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-medium">Price:</span> $
                    {listing.price?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Tag className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-medium">Type:</span>{" "}
                    {listing.type || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Bed className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-medium">Bedrooms:</span>{" "}
                    {listing.bedrooms || 0}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Bath className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-medium">Bathrooms:</span>{" "}
                    {listing.bathrooms || 0}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-medium">Size:</span>{" "}
                    {listing.size || "N/A"} sqft
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-medium">Views:</span>{" "}
                    {listing.views || 0}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-medium">Available:</span>{" "}
                    {listing.available ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {listing.description || "No description available."}
              </p>
            </div>
          </div>

          {/* Owner Information */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <div className="space-y-2 mb-4">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span>{" "}
                {listing.ownerId?.name || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Email:</span>{" "}
                {listing.ownerId?.email || "N/A"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span>{" "}
                {listing.ownerId?.phone || "N/A"}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleBookAppointment}
                className="flex-1 sm:flex-initial"
                disabled={!listing.available}
              >
                Book Appointment
              </Button>
              <Button
                variant="outline"
                onClick={handleContactLandlord}
                className="flex-1 sm:flex-initial"
                disabled={!listing.ownerId?.email}
              >
                Contact Owner
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ListingDetailsPage.displayName = "ListingDetailsPage";

export default ListingDetailsPage;
