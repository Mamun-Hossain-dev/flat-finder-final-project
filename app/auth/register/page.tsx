// app/auth/register/page.tsx
"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CldUploadWidget } from "next-cloudinary";
import { useAuth } from "@/hooks/useAuth";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Upload,
  FileText,
  ArrowLeft,
} from "lucide-react";

const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  nidNumber: yup.string().required("NID/Passport number is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  role: yup.string().required("Please select your role"),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [nidImage, setNidImage] = useState<string>("");
  const { register: registerUser } = useAuth();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setError("");
      setLoading(true);

      if (!nidImage) {
        setError("Please upload your NID/Passport image");
        return;
      }

      await registerUser(data.email, data.password, {
        name: data.name,
        phone: data.phone,
        role: data.role,
        nidNumber: data.nidNumber,
        nidImage: nidImage,
      });

      setSuccess(true);
      } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-green-600">
              Registration Successful!
            </CardTitle>
            <CardDescription>
              Please check your email to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              We have sent a verification link to{" "}
              <strong>{watch("email")}</strong>. Please click the link to
              activate your account.
            </p>
            <div className="space-y-2">
              <Link href="/auth/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
              <Link href="/auth/resend-verification">
                <Button variant="outline" className="w-full">
                  Resend Verification Email
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4">
      <div className="w-full max-w-lg mb-4 text-left">
        <Link href="/">
          <Button variant="ghost" className="px-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join FlatFinder today</CardDescription>
        </CardHeader>
        <CardContent>
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
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
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
              <p className="text-sm text-gray-500 mb-1">
                Upload a clear image of your National ID or Passport.
              </p>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} // You'll need to create this preset in Cloudinary
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
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {nidImage ? "Change Image" : "Upload NID/Passport"}
                    </Button>
                    {nidImage && (
                      <div className="text-sm text-green-600">
                        ✓ Image uploaded successfully
                      </div>
                    )}
                  </div>
                )}
              </CldUploadWidget>
            </div>

            <div>
              <Label htmlFor="role">I want to</Label>
              <Select
                onValueChange={(value) => setValue("role", value)}
                defaultValue={defaultRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buy Properties</SelectItem>
                  <SelectItem value="seller">Sell/List Properties</SelectItem>
                  <SelectItem value="tenant">Rent Properties</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <p className="text-sm text-gray-500 mb-1">
                Must be at least 6 characters.
              </p>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <p className="text-sm text-gray-500 mb-1">
                Re-enter your password to confirm.
              </p>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-blue-600 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
