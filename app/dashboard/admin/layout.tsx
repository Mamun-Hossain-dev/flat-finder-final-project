import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth-cookies";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import ResponsiveAdminLayout from "@/components/dashboard/ResponsiveAdminLayout";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const cookieStore = await cookies();
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
    <ResponsiveAdminLayout>
      {children}
    </ResponsiveAdminLayout>
  );
}
