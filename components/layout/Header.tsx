"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  Menu,
  X,
  Home,
  Building,
  HelpCircle,
  Phone,
  LogOut,
  User,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, userProfile, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (!mounted) return false;

    if (href === "/") {
      return pathname === href;
    }
    if (href.includes("?")) {
      const [basePath, queryString] = href.split("?");
      const params = new URLSearchParams(queryString);
      const typeParam = params.get("type");
      return pathname === basePath && searchParams.get("type") === typeParam;
    }
    return pathname === href;
  };

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "All Listings", href: "/listings", icon: Building },
    { name: "How It Works", href: "/how-it-works", icon: HelpCircle },
    { name: "Contact Us", href: "/contact", icon: Phone },
  ];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-900/5"
          : "bg-white/95 backdrop-blur-md border-b border-gray-200/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 rounded-xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              FlatFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group ${
                  isActive(item.href)
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {isActive(item.href) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full opacity-80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : currentUser && userProfile ? (
              <DropdownMenu onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-12 px-4 rounded-full bg-gray-50/50 hover:bg-gray-100/80 border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 ring-2 ring-white shadow-md">
                        {userProfile.profileImage ? (
                          <AvatarImage
                            src={userProfile.profileImage}
                            alt={userProfile.name}
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold text-sm">
                            {getInitials(userProfile.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col items-start min-w-0">
                        <span className="text-sm font-medium text-gray-900 truncate max-w-24">
                          {userProfile.name}
                        </span>
                      </div>
                      {isMenuOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-200" />
                      )}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 p-2 mt-2 bg-white/95 backdrop-blur-xl border border-gray-200/50 shadow-xl shadow-gray-900/10 rounded-2xl"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl mb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                        {userProfile.profileImage ? (
                          <AvatarImage
                            src={userProfile.profileImage}
                            alt={userProfile.name}
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                            {getInitials(userProfile.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userProfile.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {userProfile.email}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="my-2 bg-gray-200/50" />
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-3 h-4 w-4 text-gray-600" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  {userProfile.role === "admin" && (
                    <DropdownMenuItem
                      asChild
                      className="rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Link
                        href="/dashboard/admin/listings"
                        className="flex items-center"
                      >
                        <Settings className="mr-3 h-4 w-4 text-gray-600" />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center"
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-600" />
                      <span className="font-medium">Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2 bg-gray-200/50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-lg p-3 hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    className="h-10 px-6 rounded-full font-medium hover:bg-gray-100 transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="h-10 px-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 font-medium">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200/50 transition-all duration-300"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 text-gray-700" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200/50 bg-white/95 backdrop-blur-xl">
            <div className="py-6 px-2">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50 font-medium"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200/50">
                {currentUser && userProfile ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                      <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                        {userProfile.profileImage ? (
                          <AvatarImage
                            src={userProfile.profileImage}
                            alt={userProfile.name}
                          />
                        ) : (
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                            {getInitials(userProfile.name)}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {userProfile.name}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {userProfile.email}
                        </p>
                      </div>
                    </div>

                    {userProfile.role === "admin" && (
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Button
                          variant="outline"
                          className="w-full h-12 rounded-xl font-medium"
                        >
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl font-medium"
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl font-medium"
                      >
                        Profile Settings
                      </Button>
                    </Link>
                    <Button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      variant="destructive"
                      className="w-full h-12 rounded-xl font-medium"
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button
                        variant="outline"
                        className="w-full h-12 rounded-xl font-medium"
                      >
                        Login
                      </Button>
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-medium">
                        Register
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
