"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Shield,
  CheckCircle,
  Users,
  Sparkles,
  Home,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    location: "",
    type: "",
    maxPrice: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [particleStyles, setParticleStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    setIsLoaded(true);

    // Generate particle styles only on the client side
    const newParticleStyles = Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${2 + Math.random() * 3}s`,
    }));
    setParticleStyles(newParticleStyles);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.location) params.set("location", searchData.location);
    if (searchData.type) params.set("type", searchData.type);
    if (searchData.maxPrice) params.set("maxPrice", searchData.maxPrice);

    window.location.href = `/listings?${params.toString()}`;
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800"></div>

      {/* Animated Particles */}
      <div className="absolute inset-0">
        {particleStyles.map((style, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={style}
          />
        ))}
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-pink-400/30 to-purple-500/30 rounded-lg rotate-45 blur-lg animate-pulse"></div>
        <div className="absolute bottom-32 left-1/4 w-12 h-12 bg-gradient-to-r from-yellow-400/30 to-orange-500/30 rounded-full blur-lg animate-ping"></div>
        <div
          className="absolute top-1/3 right-1/3 w-8 h-8 bg-gradient-to-r from-green-400/30 to-teal-500/30 rounded-full blur-md animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div
          className={`max-w-5xl mx-auto text-center text-white transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          

          {/* Hero Content */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
            <span className="block bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-pulse">
              Find Your
            </span>
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent relative">
              Dream Home
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-md opacity-60 animate-ping"></div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl lg:text-3xl mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed font-light">
            Bangladesh&apos;s most{" "}
            <span className="font-semibold text-cyan-300">
              trusted platform
            </span>{" "}
            for buying, selling and renting
            <span className="font-semibold text-pink-300">
              {" "}
              verified properties
            </span>
          </p>

          {/* Enhanced Search Bar */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl mb-12 border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-3 bg-white/90 rounded-xl px-4 py-4 group-hover:bg-white transition-colors duration-300 h-16">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <Input
                    placeholder="Enter location..."
                    value={searchData.location}
                    onChange={(e) =>
                      setSearchData({ ...searchData, location: e.target.value })
                    }
                    className="border-0 focus:ring-0 text-gray-900 bg-transparent placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 rounded-xl group-hover:bg-white transition-colors duration-300">
                  <Select
                    onValueChange={(value) =>
                      setSearchData({ ...searchData, type: value })
                    }
                  >
                    <SelectTrigger className="border-0 focus:ring-0 py-4 px-4 h-full">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">🏠 For Sale</SelectItem>
                      <SelectItem value="rent">🏢 For Rent</SelectItem>
                      <SelectItem value="bachelor">🏠 Bachelor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-white/90 rounded-xl px-4 py-4 group-hover:bg-white transition-colors duration-300 h-16">
                  <Input
                    placeholder="Max Price (৳)"
                    type="number"
                    value={searchData.maxPrice}
                    onChange={(e) =>
                      setSearchData({ ...searchData, maxPrice: e.target.value })
                    }
                    className="border-0 focus:ring-0 text-gray-900 bg-transparent placeholder:text-gray-500"
                  />
                </div>
              </div>

              <Button
                onClick={handleSearch}
                size="lg"
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 h-16"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Properties
              </Button>
            </div>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link href="/auth/register?role=seller">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
              >
                <Home className="w-5 h-5 mr-2" />
                List Your Property
              </Button>
            </Link>
            <Link href="/listings">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm bg-white/10 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Browse Properties
              </Button>
            </Link>
          </div>

          {/* Enhanced Trust Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-16">
            {[
              {
                icon: Shield,
                title: "Verified Listings",
                description: "All properties verified with NID & documents",
                gradient: "from-blue-400 to-cyan-500",
                bgGradient: "from-blue-500/20 to-cyan-500/20",
              },
              {
                icon: CheckCircle,
                title: "Trusted Platform",
                description: "Secure payments & complaint system",
                gradient: "from-green-400 to-emerald-500",
                bgGradient: "from-green-500/20 to-emerald-500/20",
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "24/7 customer support & assistance",
                gradient: "from-purple-400 to-pink-500",
                bgGradient: "from-purple-500/20 to-pink-500/20",
              },
            ].map((badge, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${badge.bgGradient} backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex flex-col items-center space-y-4 text-center">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${badge.gradient} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-lg`}
                  >
                    <badge.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{badge.title}</h3>
                  <p className="text-sm opacity-90 leading-relaxed max-w-xs">
                    {badge.description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" className="w-full h-20 fill-white">
          <path d="M0,60 C300,100 600,20 900,60 C1050,80 1150,40 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>
    </section>
  );
}
