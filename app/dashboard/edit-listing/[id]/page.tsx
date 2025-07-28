"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
});

type FormData = yup.InferType<typeof schema>;

export default function EditListingPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loadingListing, setLoadingListing] = useState(true);

  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchedImages = watch("images");

  useEffect(() => {
    if (!authLoading && (!userProfile || userProfile.role !== "seller")) {
      router.push("/dashboard"); // Redirect if not a seller
    }
  }, [userProfile, authLoading, router]);

  useEffect(() => {
    if (id) {
      const fetchListing = async () => {
        try {
          setLoadingListing(true);
          const response = await fetch(`/api/listings/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch listing");
          }
          const data = await response.json();
          reset({
            title: data.title,
            description: data.description,
            type: data.type,
            location: data.location,
            price: data.price,
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            size: data.size,
            images: data.images,
          });
          setImageUrls(data.images);
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Failed to load listing for editing.",
            variant: "destructive",
          });
          router.push("/dashboard/my-listings");
        } finally {
          setLoadingListing(false);
        }
      };
      fetchListing();
    }
  }, [id, reset, router, toast]);

  useEffect(() => {
    setValue("images", imageUrls);
  }, [imageUrls, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update listing");
      }

      toast({
        title: "Success!",
        description: "Listing updated successfully.",
      });
      router.push("/dashboard/my-listings");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
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

  if (authLoading || loadingListing) {
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
            <CardTitle className="text-2xl font-bold">Edit Listing</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} rows={5} />
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
                  <Input id="city" {...register("location.city")} />
                  {errors.location?.city && <p className="text-red-500 text-sm">{errors.location.city.message}</p>}
                </div>
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" {...register("location.area")} />
                  {errors.location?.area && <p className="text-red-500 text-sm">{errors.location.area.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input id="bedrooms" type="number" {...register("bedrooms")} />
                  {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms.message}</p>}
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input id="bathrooms" type="number" {...register("bathrooms")} />
                  {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms.message}</p>}
                </div>
                <div>
                  <Label htmlFor="size">Size (sqft)</Label>
                  <Input id="size" type="number" {...register("size")} />
                  {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" {...register("price")} />
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
                        Upload More Images
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

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Updating Listing..." : "Update Listing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
