// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { userProfile, loading, currentUser } = useAuth();
  const router = useRouter();
  const [totalListings, setTotalListings] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  const fetchTotalListings = useCallback(async () => {
    if (!userProfile) return;
    try {
      const response = await fetch(`/api/listings?ownerId=${userProfile._id}`);
      if (response.ok) {
        const data = await response.json();
        setTotalListings(data.length);
      }
    } catch (error) {
      console.error("Error fetching total listings:", error);
    }
  }, [userProfile]);

  const fetchPendingBookingsCount = useCallback(async () => {
    if (!userProfile) return;
    try {
      const response = await fetch("/api/bookings/my-bookings", {
        headers: {
          Authorization: `Bearer ${document.cookie
            .split("; ")
            .find((row) => row.startsWith("auth-token="))
            ?.split("=")[1]}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const pending = data.filter((booking: any) => booking.status === "pending");
        setPendingBookingsCount(pending.length);
      }
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
    }
  }, [userProfile]);

  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/auth/login");
    } else if (!loading && userProfile) {
      console.log("User role:", userProfile.role);
      if (userProfile.role === "seller") {
        fetchTotalListings();
      }
      fetchPendingBookingsCount();
    }
  }, [loading, currentUser, userProfile, router, fetchTotalListings, fetchPendingBookingsCount]);

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Your user profile could not be loaded. Please try logging in
              again.
            </p>
            <Button onClick={() => router.push("/auth/login")}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generic Dashboard Content (will be replaced by role-specific components)
  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to your Dashboard, {userProfile.name}!
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Role: <span className="font-semibold text-blue-600">{userProfile.role}</span>
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
            <p className="text-xs text-muted-foreground">{totalListings === 0 ? "No listings yet" : "Total listings"}</p>
          </CardContent>
        </Card>
        {userProfile.role === "seller" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Manage Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/my-listings">
                <Button className="w-full">My Listings</Button>
              </Link>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/my-bookings">
              <Button className="w-full">View Bookings</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingBookingsCount}</div>
            <p className="text-xs text-muted-foreground">{pendingBookingsCount === 0 ? "No pending bookings" : "Pending bookings"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No new messages</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {userProfile.role === "seller" && <Link href="/dashboard/add-listing"><Button>Add New Listing</Button></Link>}
          {userProfile.role === "buyer" && <Button>Browse Flats</Button>}
          
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/profile")}
          >
            Edit Profile
          </Button>
          <Link href="/">
            <Button variant="default">Go to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
