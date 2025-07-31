"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { Mail, RefreshCw } from "lucide-react";
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { currentUser, refreshProfile } = useAuth();

  const resendVerification = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError("");
      // Call backend to confirm user exists, then send client-side verification email
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to resend verification email");
      }

      await sendEmailVerification(currentUser);
      setMessage("Verification email sent! Please check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkVerification = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      await currentUser.reload();
      if (currentUser.emailVerified) {
        await refreshProfile();
        // Server will handle redirection
      } else {
        setError("Email is not verified yet. Please check your inbox.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Mail className="w-16 h-16 mx-auto text-yellow-600 mb-4" />
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription>
            We&apos;ve sent a verification link to your email address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>Please check your email and click the verification link.</p>
            <p className="mt-2">
              Email: <strong>{currentUser?.email}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Button
              onClick={checkVerification}
              size="lg"
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-base sm:text-lg h-14 sm:h-16 flex items-center justify-center"
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {loading ? "Checking..." : "I've Verified My Email"}
            </Button>

            <Button
              variant="outline"
              onClick={resendVerification}
              size="lg"
              className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white backdrop-blur-xl bg-transparent font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg h-14 sm:h-16 flex items-center justify-center"
              disabled={loading}
            >
              Resend Verification Email
            </Button>
          </div>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
