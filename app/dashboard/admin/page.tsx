import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Approve or reject new property listings.</p>
            <Link href="/dashboard/admin/listings">
              <Button className="w-full">View Listings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Verify, warn, or ban users.</p>
            <Link href="/dashboard/admin/users">
              <Button className="w-full">View Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>View Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Monitor all payment and booking transactions.</p>
            <Link href="/dashboard/admin/transactions">
              <Button className="w-full">View Transactions</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Handle Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Review and resolve user complaints.</p>
            <Link href="/dashboard/admin/complaints">
              <Button className="w-full">View Complaints</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temporary Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">Review and manage temporary listings.</p>
            <Link href="/dashboard/admin/temporary-listings">
              <Button className="w-full">View Temporary Listings</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
