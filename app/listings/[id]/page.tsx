"use client";

import { useEffect, useState } from "react";
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

export default function ListingDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast(); // Fixed: Added destructuring to get toast function

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        try {
          setLoading(true);
          const response = await fetch(`/api/listings/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch listing");
          }
          const data = await response.json();
          setListing(data);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, [id, toast]); // Fixed: Added toast to dependency array

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
      <div className="min-h-screen flex items-center justify-center">
        <p>Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-2">
            {listing.title}
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            {listing.location.area}, {listing.location.city}
          </CardDescription>
          {listing.isPremium && (
            <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
              Premium Listing
            </span>
          )}
        </CardHeader>
        <CardContent>
          {/* Fixed: Only render carousel if images exist */}
          {listing.images && listing.images.length > 0 && (
            <div className="mb-6">
              <Carousel className="w-full max-w-full h-96">
                <CarouselContent className="-ml-4">
                  {" "}
                  {/* Fixed: Added proper spacing class */}
                  {listing.images.map((image, index) => (
                    <CarouselItem key={index} className="pl-4">
                      {" "}
                      {/* Fixed: Added padding left */}
                      <div className="relative w-full h-96">
                        <Image
                          src={image}
                          alt={`Listing image ${index + 1}`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="rounded-lg"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          priority={index === 0}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Details</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" /> Price:
                  ${listing.price.toLocaleString()}
                </li>
                <li className="flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-blue-600" /> Type:{" "}
                  {listing.type}
                </li>
                <li className="flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-purple-600" /> Bedrooms:{" "}
                  {listing.bedrooms}
                </li>
                <li className="flex items-center">
                  <Bath className="w-5 h-5 mr-2 text-teal-600" /> Bathrooms:{" "}
                  {listing.bathrooms}
                </li>
                <li className="flex items-center">
                  <Ruler className="w-5 h-5 mr-2 text-orange-600" /> Size:{" "}
                  {listing.size} sqft
                </li>
                <li className="flex items-center">
                  <Eye className="w-5 h-5 mr-2 text-gray-600" /> Views:{" "}
                  {listing.views}
                </li>
                <li className="flex items-center">
                  <Home className="w-5 h-5 mr-2 text-indigo-600" /> Available:{" "}
                  {listing.available ? "Yes" : "No"}
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {listing.description}
              </p>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-semibold mb-3">Owner Information</h3>
            <p className="text-gray-700">Name: {listing.ownerId.name}</p>
            <p className="text-gray-700">Email: {listing.ownerId.email}</p>
            <p className="text-gray-700">Phone: {listing.ownerId.phone}</p>
            <div className="mt-4 space-x-4">
              <Button>Book Appointment</Button>
              <Button variant="outline">Contact Landlord</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
