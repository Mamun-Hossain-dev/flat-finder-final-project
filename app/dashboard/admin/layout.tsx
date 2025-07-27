import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth-cookies";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import AdminNav from "@/components/dashboard/AdminNav";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;

  const decodedToken = await verifyToken(token);

  if (!decodedToken || !decodedToken.firebaseUid) {
    redirect("/auth/login");
  }

  await dbConnect();
  const user = await User.findOne({ firebaseUid: decodedToken.firebaseUid });

  if (!user || user.role !== "admin") {
    redirect("/dashboard"); // Redirect non-admins
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-gray-50 p-4">
        <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
        <AdminNav />
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
