"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Listing {
  _id: string;
  title: string;
  type: "sale" | "rent" | "bachelor";
  location: { area: string; city: string };
  isApproved: boolean;
  isBanned: boolean;
}

export default function AdminListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/listings"); // Assuming this fetches all listings
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      const data = await response.json();
      setListings(data);
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
  };

  useEffect(() => {
    fetchListings();
  }, []);

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
      fetchListings(); // Re-fetch listings to update UI
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
      fetchListings(); // Re-fetch listings to update UI
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
          {listings.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No listings to manage.
            </div>
          ) : (
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
                {listings.map((listing) => (
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
                      <div className="flex justify-end space-x-2">
                        {!listing.isApproved && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange(listing._id, "approved")}
                          >
                            Approve
                          </Button>
                        )}
                        {!listing.isBanned && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleStatusChange(listing._id, "banned")}
                          >
                            Ban
                          </Button>
                        )}
                        {listing.isBanned && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleStatusChange(listing._id, "pending")}
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
                            >
                              Mark Sold
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkStatus(listing._id, "rented")}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}