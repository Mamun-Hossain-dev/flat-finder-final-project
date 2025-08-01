import "./globals.css";
import { Poppins } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import { Providers } from "@/app/providers";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import LoadingSpinner from "@/components/common/LoadingSpinner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "FlatFinder - Buy, Sell & Rent Flats in Bangladesh",
  description:
    "Trusted platform for buying, selling and renting flats in Bangladesh with verified listings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <Providers>
          <AuthProvider>
            <Suspense fallback={<LoadingSpinner />}>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <Toaster />
              </div>
            </Suspense>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
