"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Listing {
  _id: string;
  title: string;
  type: "sale" | "rent" | "bachelor" | "sold" | "rented";
  location: { area: string; city: string };
  isApproved?: boolean; // Optional for temporary listings
  isBanned?: boolean; // Optional for temporary listings
}

export default function AdminListingsPage() {
  const [temporaryListings, setTemporaryListings] = useState<Listing[]>([]);
  const [permanentListings, setPermanentListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAllListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch temporary listings for admin approval
      const tempResponse = await fetch("/api/temporary-listings");
      if (!tempResponse.ok) {
        throw new Error("Failed to fetch temporary listings");
      }
      const tempData = await tempResponse.json();
      setTemporaryListings(tempData);

      // Fetch all permanent listings (including pending, approved, banned for admin view)
      const permResponse = await fetch("/api/listings?status=all"); // Assuming a new status=all filter for admin
      if (!permResponse.ok) {
        throw new Error("Failed to fetch permanent listings");
      }
      const permData = await permResponse.json();
      setPermanentListings(permData);

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to load listings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllListings();
  }, [fetchAllListings]);

  const handleApproveListing = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/temporary-listings/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve listing");
      }

      toast({
        title: "Success",
        description: "Listing approved and moved to permanent listings.",
      });
      fetchAllListings(); // Re-fetch all listings to update UI
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to approve listing.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, status: "approved" | "banned" | "pending") => {
    try {
      const response = await fetch(`/api/listings/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update listing status");
      }

      toast({
        title: "Success",
        description: `Listing status updated to ${status}.`,
      });
      fetchAllListings(); // Re-fetch all listings to update UI
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update listing status.",
        variant: "destructive",
      });
    }
  };

  const handleMarkStatus = async (id: string, status: "sold" | "rented") => {
    try {
      const response = await fetch(`/api/listings/${id}/mark-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to mark listing status");
      }

      toast({
        title: "Success",
        description: `Listing marked as ${status}.`,
      });
      fetchAllListings(); // Re-fetch all listings to update UI
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to mark listing status.",
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Manage Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Temporary Listings (Pending Approval)</h2>
          {temporaryListings.length === 0 ? (
            <div className="text-center text-gray-500 text-lg mb-8">
              No temporary listings to approve.
            </div>
          ) : (
            <div className="overflow-x-auto mb-8">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {temporaryListings.map((listing) => (
                    <TableRow key={listing._id}>
                      <TableCell>
                        <Link href={`/dashboard/admin/temporary-listings/${listing._id}`} className="text-blue-600 hover:underline">
                          {listing.title}
                        </Link>
                      </TableCell>
                      <TableCell>{listing.type}</TableCell>
                      <TableCell>{listing.location.area}, {listing.location.city}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveListing(listing._id)}
                          className="w-full sm:w-auto"
                        >
                          Approve
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <h2 className="text-xl font-semibold mb-4">Permanent Listings</h2>
          {permanentListings.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No permanent listings to manage.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permanentListings.map((listing) => (
                    <TableRow key={listing._id}>
                      <TableCell>
                        <Link href={`/listings/${listing._id}`} className="text-blue-600 hover:underline">
                          {listing.title}
                        </Link>
                      </TableCell>
                      <TableCell>{listing.type}</TableCell>
                      <TableCell>{listing.location.area}, {listing.location.city}</TableCell>
                      <TableCell>
                        {listing.isApproved && !listing.isBanned && <Badge variant="default">Approved</Badge>}
                        {!listing.isApproved && !listing.isBanned && <Badge variant="secondary">Pending</Badge>}
                        {listing.isBanned && <Badge variant="destructive">Banned</Badge>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col space-y-2 items-end sm:flex-row sm:space-y-0 sm:space-x-2">
                          {!listing.isBanned && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusChange(listing._id, "banned")}
                              className="w-full sm:w-auto"
                            >
                              Ban
                            </Button>
                          )}
                          {listing.isBanned && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleStatusChange(listing._id, "approved")}
                              className="w-full sm:w-auto"
                            >
                              Unban
                            </Button>
                          )}
                          {listing.isApproved && !listing.isBanned && listing.type !== "sold" && listing.type !== "rented" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkStatus(listing._id, "sold")}
                                className="w-full sm:w-auto"
                              >
                                Mark Sold
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleMarkStatus(listing._id, "rented")}
                                className="w-full sm:w-auto"
                              >
                                Mark Rented
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}