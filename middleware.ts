// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/auth-cookies";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/admin", "/profile"];
  const authRoutes = ["/auth/login", "/auth/register"];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get the auth token from cookies
  const authToken = request.cookies.get("auth-token")?.value;
  console.log("Middleware: authToken from cookies:", authToken ? "Present" : "Not Present");

  // Verify the token
  const isValidToken = authToken ? verifyAuthToken(request) : null;
  console.log("Middleware: isValidToken:", isValidToken ? "Valid" : "Invalid/Null");

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isValidToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
