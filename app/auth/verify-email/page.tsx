"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const resendVerification = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError("");
      await sendEmailVerification(currentUser);
      setMessage("Verification email sent! Please check your inbox.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
              className="w-full"
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {loading ? "Checking..." : "I've Verified My Email"}
            </Button>

            <Button
              variant="outline"
              onClick={resendVerification}
              className="w-full"
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
