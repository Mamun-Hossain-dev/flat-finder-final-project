// app/dashboard/profile/page.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CldUploadWidget } from "next-cloudinary";
import { User, Mail, Phone, FileText, Upload, Save } from "lucide-react";
import Link from "next/link";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  phone: yup.string().required("Phone number is required"),
  nidNumber: yup.string().required("NID/Passport number is required"),
});

export default function ProfilePage() {
  const { userProfile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState(
    userProfile?.profileImage || ""
  );
  const [nidImage, setNidImage] = useState(userProfile?.nidImage || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: userProfile?.name || "",
      phone: userProfile?.phone || "",
      nidNumber: userProfile?.nidNumber || "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setError("");
      setLoading(true);

      const updateData = {
        ...data,
        ...(profileImage && { profileImage }),
        ...(nidImage && { nidImage }),
      };

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Update failed");
      }

      await refreshProfile();
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      seller: "bg-green-100 text-green-800",
      buyer: "bg-blue-100 text-blue-800",
      tenant: "bg-purple-100 text-purple-800",
    };
    return colors[role as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-4xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>
        <Link href="/">
          <Button variant="default">Go to Home</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                {profileImage || userProfile.profileImage ? (
                  <AvatarImage
                    src={profileImage || userProfile.profileImage || ""}
                    alt={userProfile.name}
                    sizes="(max-width: 768px) 100px, 120px"
                  />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                    {getInitials(userProfile.name)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <CardTitle className="mt-4">{userProfile.name}</CardTitle>
            <Badge className={getRoleColor(userProfile.role)}>
              {userProfile.role.charAt(0).toUpperCase() +
                userProfile.role.slice(1)}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              {userProfile.email}
            </div>
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              {userProfile.phone}
            </div>
            {userProfile.nidNumber && (
              <div className="flex items-center text-sm">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                NID: {userProfile.nidNumber}
              </div>
            )}
            <div className="pt-3">
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={async (result: any) => {
                  const newProfileImage = result.info.secure_url;
                  setProfileImage(newProfileImage);
                  // Manually trigger form submission with updated image
                  await onSubmit({
                    ...userProfile,
                    profileImage: newProfileImage,
                  });
                }}
              >
                {({ open }) => (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => open()}
                    className="w-full text-center"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Update Photo
                  </Button>
                )}
              </CldUploadWidget>
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <Alert className="mb-4">
                <AlertDescription>
                  Profile updated successfully!
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("name")}
                    placeholder="Enter your full name"
                    className="pl-10"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    value={userProfile.email}
                    disabled
                    className="pl-10 bg-gray-50"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("phone")}
                    placeholder="Enter your phone number"
                    className="pl-10"
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="nidNumber">NID/Passport Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    {...register("nidNumber")}
                    placeholder="Enter your NID/Passport number"
                    className="pl-10"
                  />
                </div>
                {errors.nidNumber && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.nidNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="nidImage">NID/Passport Image</Label>
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
                  }
                  onSuccess={(result: any) => {
                    setNidImage(result.info.secure_url);
                  }}
                >
                  {({ open }) => (
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => open()}
                        className="w-full text-center"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {nidImage || userProfile.nidImage
                          ? "Change NID Image"
                          : "Upload NID/Passport"}
                      </Button>
                      {(nidImage || userProfile.nidImage) && (
                        <div className="text-sm text-green-600 text-center mt-2">
                          ✓ NID image uploaded
                        </div>
                      )}
                    </div>
                  )}
                </CldUploadWidget>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
