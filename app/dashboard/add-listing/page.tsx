"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PaymentForm from "@/components/PaymentForm";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  type: yup.string().oneOf(["sale", "rent", "bachelor"]).required("Type is required"),
  location: yup.object().shape({
    area: yup.string().required("Area is required"),
    city: yup.string().required("City is required"),
  }).required("Location is required"),
  price: yup.number().typeError("Price must be a number").positive("Price must be positive").required("Price is required"),
  bedrooms: yup.number().typeError("Bedrooms must be a number").integer("Bedrooms must be an integer").positive("Bedrooms must be positive").required("Bedrooms is required"),
  bathrooms: yup.number().typeError("Bathrooms must be a number").integer("Bathrooms must be an integer").positive("Bathrooms must be positive").required("Bathrooms is required"),
  size: yup.number().typeError("Size must be a number").positive("Size must be positive").required("Size is required"),
  images: yup.array().of(yup.string()).min(1, "At least one image is required").required("Images are required"),
  isPremium: yup.boolean().required("Premium status is required"),
});

type FormData = yup.InferType<typeof schema>;

export default function AddListingPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [calculatedFee, setCalculatedFee] = useState<number | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      images: [],
      location: { area: "", city: "" },
      isPremium: false, // Default to normal
    },
  });

  const { toast } = useToast();

  const watchedImages = watch("images");
  const watchedType = watch("type");
  const watchedPrice = watch("price");

  // Effect to automatically determine isPremium based on price and type
  useEffect(() => {
    if (watchedPrice && watchedType) {
      let newIsPremium = false;
      if (watchedType === "sale") {
        newIsPremium = watchedPrice >= 7000000; // 70 lakh
      } else if (watchedType === "rent") {
        newIsPremium = watchedPrice >= 35000;
      }
      setValue("isPremium", newIsPremium);
    }
  }, [watchedPrice, watchedType, setValue]);

  useEffect(() => {
    if (!authLoading && (!userProfile || userProfile.role !== "seller")) {
      router.push("/dashboard"); // Redirect if not a seller
    }
  }, [userProfile, authLoading, router]);

  useEffect(() => {
    setValue("images", imageUrls);
  }, [imageUrls, setValue]);

  const onSubmit = async (data: FormData) => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "User not logged in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Save temporary listing
      const tempListingResponse = await fetch("/api/temporary-listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!tempListingResponse.ok) {
        const errorData = await tempListingResponse.json();
        throw new Error(errorData.error || "Failed to save temporary listing.");
      }
      const tempListingData = await tempListingResponse.json();
      console.log("Full Temporary Listing API Response:", tempListingData); // Added log
      const { _id: temporaryListingId } = tempListingData;
      console.log("Temporary Listing ID obtained from API:", temporaryListingId); // Added log

      let listingTypeForFee: "sale" | "rent" | "bachelor" | "premium_sell" | "normal_sell" | "premium_rent" | "normal_rent" | "bachelor_room" = data.type;
      if (data.type === "sale") {
        listingTypeForFee = data.isPremium ? "premium_sell" : "normal_sell";
      } else if (data.type === "rent") {
        listingTypeForFee = data.isPremium ? "premium_rent" : "normal_rent";
      } else if (data.type === "bachelor") {
        listingTypeForFee = "bachelor_room";
      }

      const feeResponse = await fetch("/api/payment/calculate-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userProfile._id,
          type: listingTypeForFee,
          temporaryListingId, // Pass temporary listing ID to payment init
        }),
      });

      if (!feeResponse.ok) {
        const errorData = await feeResponse.json();
        throw new Error(errorData.error || "Failed to calculate fee.");
      }

      const { fee } = await feeResponse.json();
      setCalculatedFee(fee);
      setShowPaymentForm(true);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred during fee calculation.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  

  const onUploadSuccess = (result: any) => {
    const newImageUrl = result.info.secure_url;
    setImageUrls((prevUrls) => [...prevUrls, newImageUrl]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <div className="container mx-auto py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add New Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} placeholder="e.g., Spacious 3-Bedroom Apartment" />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} rows={5} placeholder="Describe your property in detail, including amenities, nearby facilities, etc." />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={(value) => setValue("type", value as "sale" | "rent" | "bachelor")} value={watch("type")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">For Sale</SelectItem>
                    <SelectItem value="rent">For Rent</SelectItem>
                    <SelectItem value="bachelor">For Bachelor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register("location.city")} placeholder="e.g., Dhaka" />
                  {errors.location?.city && <p className="text-red-500 text-sm">{errors.location.city.message}</p>}
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" {...register("location.area")} placeholder="e.g., Gulshan 1" />
                  {errors.location?.area && <p className="text-red-500 text-sm">{errors.location.area.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" {...register("bedrooms")} placeholder="e.g., 3" />
                  {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>}
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" {...register("bathrooms")} placeholder="e.g., 2" />
                  {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>}
                </div>
                <div>
                  <Label htmlFor="size">Size (sqft)</Label>
                  <Input id="size" type="number" {...register("size")} placeholder="e.g., 1200" />
                  {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" {...register("price")} placeholder="e.g., 25000" />
                {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
              </div>

              <div>
                <Label>Images</Label>
                <CldUploadWidget
                  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                  onSuccess={onUploadSuccess}
                >
                  {({ open }) => {
                    return (
                      <Button type="button" onClick={() => open()}>
                        Upload Images
                      </Button>
                    );
                  }}
                </CldUploadWidget>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {watchedImages.map((url, index) => (
                    url && (
                      <div key={index} className="relative w-full h-32">
                        <Image src={url} alt={`Uploaded image ${index + 1}`} fill style={{ objectFit: "cover" }} className="rounded-md" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" />
                      </div>
                    )
                  ))}
                </div>
                {errors.images && <p className="text-red-500 text-sm">{errors.images.message}</p>}
              </div>

              {!showPaymentForm && (
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Calculating Fee..." : "Proceed to Payment"}
                </Button>
              )}

              {showPaymentForm && calculatedFee !== null && userProfile && (
                <div className="mt-6 p-4 border rounded-md bg-blue-50">
                  <h3 className="text-lg font-semibold mb-2">Payment Required</h3>
                  <p className="mb-4">Your listing fee is: ৳{calculatedFee}</p>
                  <PaymentForm
                    listingType={watch("isPremium") ? `premium_${watch("type")}` : `normal_${watch("type")}`}
                    amount={calculatedFee}
                    userId={userProfile._id}
                    userInfo={{
                      name: userProfile.name,
                      email: userProfile.email,
                      phone: userProfile.phone,
                    }}
                  />
                  <Button variant="outline" onClick={() => setShowPaymentForm(false)} className="mt-2 w-full">
                    Cancel Payment
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
