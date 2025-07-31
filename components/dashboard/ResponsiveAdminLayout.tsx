"use client";

import { useState, useEffect, ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminNav from "@/components/dashboard/AdminNav";

interface ResponsiveAdminLayoutProps {
  children: ReactNode;
}

export default function ResponsiveAdminLayout({ children }: ResponsiveAdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar starts open by default
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className={`grid min-h-screen w-full ${isSidebarOpen ? "md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr]" : "md:grid-cols-[1fr]"}`}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-gray-50 p-4 border-r transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0 md:relative md:flex md:flex-col md:w-auto" : "-translate-x-full md:hidden"}
        `}
      >
        {/* Sidebar Header (only visible on mobile when sidebar is open, or always on desktop) */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold whitespace-nowrap">Admin Dashboard</h2>
          {/* Close button for mobile sidebar */}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="md:hidden">
            <X className="h-6 w-6" />
          </Button>
        </div>
        <AdminNav />
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex flex-col md:col-span-1">
        {/* Top Bar for main content (always visible) */}
        <header className="sticky top-0 z-30 flex items-center justify-between bg-white/95 backdrop-blur-md border-b p-4">
          <h2 className="text-xl font-semibold md:hidden">Admin Dashboard</h2> {/* Only show on mobile */}
          {/* Hamburger menu always visible, positioned right */}
          <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="ml-auto">
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 xl:p-12">
          {children}
        </main>
      </div>
    </div>
  );
}