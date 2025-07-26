"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "seller" | "buyer" | "tenant";
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!userProfile) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && userProfile.role !== requiredRole) {
        router.push("/dashboard"); // Redirect to dashboard if role doesn't match
        return;
      }

      if (!userProfile.isVerified) {
        router.push("/auth/verify-email");
        return;
      }
    }
  }, [userProfile, loading, router, requiredRole, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!userProfile || (requiredRole && userProfile.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
