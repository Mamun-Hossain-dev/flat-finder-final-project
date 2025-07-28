"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Complaint {
  _id: string;
  userId: { name: string; email: string };
  targetType: "user" | "listing";
  targetId: string;
  reason: string;
  description?: string;
  status: "pending" | "reviewed" | "resolved" | "rejected";
  createdAt: string;
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/complaints");
      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }
      const data = await response.json();
      setComplaints(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to load complaints.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleStatusChange = async (id: string, status: "pending" | "reviewed" | "resolved" | "rejected") => {
    try {
      const response = await fetch(`/api/complaints/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update complaint status");
      }

      toast({
        title: "Success",
        description: `Complaint status updated to ${status}.`,
      });
      fetchComplaints(); // Re-fetch complaints to update UI
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update complaint status.",
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
          <CardTitle className="text-2xl font-bold">Manage Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No complaints to manage.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Complainant</TableHead>
                  <TableHead>Target Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint._id}>
                    <TableCell>{complaint.userId.name} ({complaint.userId.email})</TableCell>
                    <TableCell>{complaint.targetType}</TableCell>
                    <TableCell>{complaint.reason}</TableCell>
                    <TableCell>{complaint.description || "N/A"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          complaint.status === "pending"
                            ? "secondary"
                            : complaint.status === "resolved"
                            ? "default"
                            : "outline"
                        }
                      >
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        onValueChange={(value) =>
                          handleStatusChange(complaint._id, value as "pending" | "reviewed" | "resolved" | "rejected")
                        }
                        value={complaint.status}
                      >
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="reviewed">Reviewed</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
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
