// components/layout/Navigations.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Navigations = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center space-x-4">
      <Link href="/dashboard">
        <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"}>
          Dashboard
        </Button>
      </Link>
      {user && (
        <Link href="/dashboard/profile">
          <Button
            variant={pathname === "/dashboard/profile" ? "secondary" : "ghost"}
          >
            Profile Settings
          </Button>
        </Link>
      )}
      {!user && (
        <>
          <Link href="/auth/login">
            <Button variant={pathname === "/auth/login" ? "secondary" : "ghost"}>
              Login
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              variant={pathname === "/auth/register" ? "secondary" : "ghost"}
            >
              Register
            </Button>
          </Link>
        </>
      )}
      {user && (
        <Button onClick={logout} variant="ghost">
          Logout
        </Button>
      )}
    </nav>
  );
};

export default Navigations;