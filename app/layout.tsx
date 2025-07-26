import "./globals.css";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import { Providers } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
