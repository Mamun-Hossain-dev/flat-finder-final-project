"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { List, Users, Flag, DollarSign } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Manage Listings",
      href: "/dashboard/admin/listings",
      icon: List,
    },
    {
      name: "Manage Complaints",
      href: "/dashboard/admin/complaints",
      icon: Flag,
    },
    {
      name: "Manage Users",
      href: "/dashboard/admin/users",
      icon: Users,
    },
    {
      name: "Manage Transactions",
      href: "/dashboard/admin/transactions",
      icon: DollarSign,
    },
  ];

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <span
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              pathname === item.href ? "bg-accent" : "transparent"
            )}
          >
            <item.icon className="mr-2 h-4 w-4" />
            <span>{item.name}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}
