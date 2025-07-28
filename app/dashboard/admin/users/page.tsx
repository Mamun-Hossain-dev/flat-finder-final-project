"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import Image from "next/image";
import { Label } from "@/components/ui/label";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  isBanned: boolean;
  warnings: { type: string; reason: string; date: string }[];
  nidNumber?: string;
  nidImage?: string;
  profileImage?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message || "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleAssignCard = async (userId: string, cardType: "yellow" | "red") => {
    try {
      const response = await fetch(`/api/users/${userId}/assign-card`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cardType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to assign card");
      }

      toast({
        title: "Success",
        description: `Assigned ${cardType} card to user.`,
      });
      fetchUsers(); // Re-fetch users to update UI
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to assign card.",
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
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Manage Users</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">
              No users to manage.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Warnings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : (
                        <Badge variant="default">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.warnings.map((warning, index) => (
                        <Badge key={index} variant={warning.type === "yellow" ? "secondary" : "destructive"} className="mr-1">
                          {warning.type}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(user)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignCard(user._id, "yellow")}
                        >
                          Yellow Card
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleAssignCard(user._id, "red")}
                        >
                          Red Card
                        </Button>
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

      {/* User Details Modal */}
      <Dialog open={showUserDetailsModal} onOpenChange={setShowUserDetailsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View the complete profile information for this user.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="col-span-1 md:col-span-2 flex justify-center mb-4">
                {selectedUser.profileImage ? (
                  <Image
                    src={selectedUser.profileImage}
                    alt={selectedUser.name}
                    width={120}
                    height={120}
                    className="rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-center p-2">
                    No Profile Image
                  </div>
                )}
              </div>

              <div className="col-span-1">
                <p className="font-medium">Name:</p>
                <p>{selectedUser.name}</p>
              </div>
              <div className="col-span-1">
                <p className="font-medium">Email:</p>
                <p>{selectedUser.email}</p>
              </div>
              <div className="col-span-1">
                <p className="font-medium">Phone:</p>
                <p>{selectedUser.phone || "N/A"}</p>
              </div>
              <div className="col-span-1">
                <p className="font-medium">Role:</p>
                <p>{selectedUser.role}</p>
              </div>
              <div className="col-span-1">
                <p className="font-medium">NID Number:</p>
                <p>{selectedUser.nidNumber || "N/A"}</p>
              </div>

              <div className="col-span-1 md:col-span-2 mt-4">
                <p className="font-medium mb-2">NID Image:</p>
                {selectedUser.nidImage ? (
                  <Image
                    src={selectedUser.nidImage}
                    alt="NID Image"
                    width={300}
                    height={200}
                    className="rounded-lg object-contain border border-gray-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-center p-4 rounded-lg">
                    No NID Image Available
                  </div>
                )}
              </div>

              <div className="col-span-1">
                <p className="font-medium">Banned:</p>
                <p>{selectedUser.isBanned ? "Yes" : "No"}</p>
              </div>
              <div className="col-span-1">
                <p className="font-medium">Warnings:</p>
                <p>
                  {selectedUser.warnings.length > 0
                    ? selectedUser.warnings
                        .map((w) => `${w.type} (${new Date(w.date).toLocaleDateString()})`)
                        .join(", ")
                    : "None"}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
