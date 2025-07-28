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
import { Home, Bed, Bath, Ruler, DollarSign, Tag, Eye, Phone, Mail } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PaymentForm from "@/components/PaymentForm"; // Import PaymentForm

interface Listing {
  _id: string;
  title: string;
  description: string;
  images: string[];
  type: "sale" | "rent" | "bachelor" | "sold";
  location: { area: string; city: string };
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  isPremium: boolean;
  ownerId: { _id: string; name: string; email: string; phone: string };
  views: number;
  available: boolean;
  isApproved: boolean;
}

const ListingDetailsPage = memo(() => {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { userProfile } = useAuth();
  const [showSellerDetails, setShowSellerDetails] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null);
  const [hasPaidForAppointment, setHasPaidForAppointment] = useState(false); // New state for payment status

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

      if (!data || typeof data !== "object") {
        throw new Error("Invalid listing data received");
      }

      setListing(data);

      // Check localStorage for payment status after listing and userProfile are loaded
      if (userProfile?._id && data._id) {
        const paymentKey = `paid_appointment_${userProfile._id}_${data._id}`;
        const paidStatus = localStorage.getItem(paymentKey) === "true";
        setHasPaidForAppointment(paidStatus);
        if (paidStatus) {
          setShowSellerDetails(true); // If already paid, show seller details directly
        }
      }

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
  }, [id, toast, userProfile]); // Add userProfile to dependencies

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  const openWhatsAppChat = useCallback(() => {
    if (!listing || !userProfile) return;

    const adminPhoneNumber = "01640571091"; // Admin WhatsApp number
    const message = `Hello, I'm interested in booking an appointment for the flat listing: ${listing.title} (ID: ${listing._id}).\nLocation: ${listing.location?.area}, ${listing.location?.city}.\nPrice: ${listing.price?.toLocaleString()}.\nDetails: ${listing.bedrooms} Beds, ${listing.bathrooms} Baths, ${listing.size} sqft, Type: ${listing.type}.\nMy details are - Name: ${userProfile.name}, Email: ${userProfile.email}, Phone: ${userProfile.phone}, Role: ${userProfile.role}.`;
    const whatsappUrl = `https://wa.me/${adminPhoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Appointment Request Sent",
      description: "You've been redirected to WhatsApp to contact the admin.",
    });
  }, [listing, userProfile, toast]);

  const handleBookAppointment = useCallback(async () => {
    if (!listing || !userProfile?._id) {
      toast({
        title: "Error",
        description: "Could not proceed. Missing listing or user ID.",
        variant: "destructive",
      });
      return;
    }

    if (hasPaidForAppointment) {
      openWhatsAppChat();
      return;
    }

    if (listing.type === "rent" || listing.type === "bachelor") {
      setShowSellerDetails(true);
      openWhatsAppChat(); // Open WhatsApp directly for free listings
      toast({
        title: "Seller Details & WhatsApp Unlocked",
        description: "You can now contact the seller directly via WhatsApp.",
      });
    } else if (listing.type === "sale") {
      try {
        const feeResponse = await fetch("/api/payment/calculate-appointment-fee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userProfile._id,
            listingId: listing._id,
          }),
        });

        if (!feeResponse.ok) {
          const errorData = await feeResponse.json();
          throw new Error(errorData.error || "Failed to calculate appointment fee.");
        }

        const { fee } = await feeResponse.json();
        setCalculatedFee(fee);
        setShowPaymentForm(true);

      } catch (err: any) {
        toast({
          title: "Error",
          description: err.message || "An unexpected error occurred during fee calculation.",
          variant: "destructive",
        });
      }
    }
  }, [listing, userProfile, toast, hasPaidForAppointment, openWhatsAppChat]);

  const handlePaymentSuccess = useCallback(() => {
    setShowPaymentForm(false);
    setShowSellerDetails(true);
    setHasPaidForAppointment(true); // Mark as paid
    if (userProfile?._id && listing?._id) {
      localStorage.setItem(`paid_appointment_${userProfile._id}_${listing._id}`, "true");
    }
    toast({
      title: "Payment Successful",
      description: "Seller details are now visible. Redirecting to WhatsApp...",
    });
    openWhatsAppChat(); // Redirect to WhatsApp after successful payment
  }, [toast, userProfile, listing, openWhatsAppChat]);

  const handlePaymentCancel = useCallback(() => {
    setShowPaymentForm(false);
    toast({
      title: "Payment Cancelled",
      description: "Appointment booking cancelled.",
      variant: "default",
    });
  }, [toast]);

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
      <Card
        className={`max-w-5xl mx-auto ${
          listing.type === "sold" || !listing.available
            ? "opacity-70 grayscale"
            : ""
        }`}
      >
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
            {listing.type === "sold" && (
              <span className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white w-fit">
                Sold
              </span>
            )}
            {!listing.available && listing.type !== "sold" && (
              <span className="inline-flex items-center rounded-md bg-gray-600 px-2 py-1 text-xs font-medium text-white w-fit">
                Unavailable
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
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-image.jpg";
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

          {/* Booking/Contact Section */}
          <div className="border-t pt-6">
            {userProfile && !showSellerDetails && !showPaymentForm && !hasPaidForAppointment && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleBookAppointment}
                  className="flex-1 sm:flex-initial"
                  disabled={!listing.available}
                >
                  Book Appointment via WhatsApp
                </Button>
              </div>
            )}

            {userProfile && hasPaidForAppointment && (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={openWhatsAppChat}
                  className="flex-1 sm:flex-initial bg-green-500 hover:bg-green-600"
                >
                  Payment Success & Appointment via WhatsApp
                </Button>
              </div>
            )}

            {showPaymentForm && calculatedFee !== null && userProfile && (
              <div className="mt-6 p-4 border rounded-md bg-blue-50">
                <h3 className="text-lg font-semibold mb-2">Payment Required</h3>
                <p className="mb-4">Appointment booking fee: ৳{calculatedFee}</p>
                <PaymentForm
                  listingType="appointment_booking" // A new type for appointment booking
                  amount={calculatedFee}
                  userId={userProfile._id}
                  userInfo={{
                    name: userProfile.name,
                    email: userProfile.email,
                    phone: userProfile.phone,
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentCancel={handlePaymentCancel}
                />
                <Button variant="outline" onClick={handlePaymentCancel} className="mt-2 w-full">
                  Cancel Payment
                </Button>
              </div>
            )}

            {showSellerDetails && listing.ownerId && (
              <div className="mt-6 p-4 border rounded-md bg-green-50">
                <h3 className="text-lg font-semibold mb-2">Seller Details</h3>
                <p className="flex items-center mb-1"><Mail className="w-4 h-4 mr-2" /> Email: {listing.ownerId.email}</p>
                <p className="flex items-center"><Phone className="w-4 h-4 mr-2" /> Phone: {listing.ownerId.phone}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

ListingDetailsPage.displayName = "ListingDetailsPage";

export default ListingDetailsPage;
