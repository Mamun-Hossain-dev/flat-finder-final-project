"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Shield, CheckCircle, Users } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    location: "",
    type: "",
    maxPrice: "",
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.location) params.set("location", searchData.location);
    if (searchData.type) params.set("type", searchData.type);
    if (searchData.maxPrice) params.set("maxPrice", searchData.maxPrice);

    window.location.href = `/listings?${params.toString()}`;
  };

  return (
    <section className="relative min-h-[80vh] flex items-center gradient-bg">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Hero Content */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Dream Home
            </span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 opacity-90 animate-fade-in">
            Trusted platform for buying, selling and renting verified flats in
            Bangladesh
          </p>

          {/* Search Bar */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Enter location..."
                  value={searchData.location}
                  onChange={(e) =>
                    setSearchData({ ...searchData, location: e.target.value })
                  }
                  className="border-0 focus:ring-0 text-gray-900"
                />
              </div>

              <Select
                onValueChange={(value) =>
                  setSearchData({ ...searchData, type: value })
                }
              >
                <SelectTrigger className="border-0 focus:ring-0">
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="bachelor">Bachelor</SelectItem>
                </SelectContent>
              </Select>

              <Input
                placeholder="Max Price (BDT)"
                type="number"
                value={searchData.maxPrice}
                onChange={(e) =>
                  setSearchData({ ...searchData, maxPrice: e.target.value })
                }
                className="border-0 focus:ring-0 text-gray-900"
              />

              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register?role=seller">
              <Button
                size="lg"
                variant="secondary"
                className="glass-effect text-gray-900 hover:bg-white/90"
              >
                List Your Property
              </Button>
            </Link>
            <Link href="/listings">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                Browse Properties
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Verified Listings</h3>
              <p className="text-sm opacity-80">
                All properties verified with NID & documents
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Trusted Platform</h3>
              <p className="text-sm opacity-80">
                Secure payments & complaint system
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold">Expert Support</h3>
              <p className="text-sm opacity-80">
                24/7 customer support & assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
