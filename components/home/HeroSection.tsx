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
  Home,
  TrendingUp,
  Star,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [searchData, setSearchData] = useState({
    location: "",
    type: "",
    maxPrice: "",
  });

  const [isLoaded, setIsLoaded] = useState(false);
  const [particleStyles, setParticleStyles] = useState<React.CSSProperties[]>(
    []
  );

  useEffect(() => {
    setIsLoaded(true);

    // Generate particle styles only on the client side
    const newParticleStyles = Array.from({ length: 30 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 4}s`,
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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 sm:pt-24 lg:pt-28">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-purple-900/50 via-transparent to-cyan-900/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particleStyles.map((style, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-float ${
              i % 3 === 0
                ? "w-1 h-1 bg-blue-400/40"
                : i % 3 === 1
                ? "w-2 h-2 bg-cyan-300/30"
                : "w-1.5 h-1.5 bg-indigo-300/35"
            }`}
            style={style}
          />
        ))}
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-[10%] w-32 h-32 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-[15%] w-24 h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl rotate-45 blur-2xl animate-spin-slow"></div>
        <div className="absolute bottom-1/3 left-[20%] w-20 h-20 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-full blur-2xl animate-bounce-slow"></div>
        <div className="absolute top-1/2 right-[25%] w-16 h-16 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 rounded-lg rotate-12 blur-xl animate-pulse"></div>

        {/* Decorative Stars */}
        <Star className="absolute top-[20%] left-[15%] w-4 h-4 text-cyan-400/60 animate-twinkle" />
        <Sparkles className="absolute top-[15%] right-[20%] w-5 h-5 text-blue-400/50 animate-twinkle-delayed" />
        <Star className="absolute bottom-[25%] right-[10%] w-3 h-3 text-indigo-400/70 animate-twinkle" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center text-white transition-all duration-1000 ease-out ${
              isLoaded
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* Hero Headlines */}
            <div className="mb-8 sm:mb-12 lg:mb-16 space-y-4 sm:space-y-6 pt-8 sm:pt-12 lg:pt-16">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent animate-gradient-slow">
                  Find Your
                </span>
                <span className="relative block bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 bg-clip-text text-transparent drop-shadow-lg">
                  Dream Home
                  <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-md opacity-70 animate-ping"></div>
                  <div className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 bg-cyan-300 rounded-full animate-pulse"></div>
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl mb-8 sm:mb-12 lg:mb-16 opacity-90 max-w-5xl mx-auto leading-relaxed font-light px-4">
                Bangladesh&apos;s most{" "}
                <span className="font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text">
                  trusted platform
                </span>{" "}
                for buying, selling, and renting{" "}
                <span className="font-semibold text-transparent bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text">
                  verified properties
                </span>
              </p>
            </div>

            {/* Enhanced Search Interface */}
            <div className="mb-8 sm:mb-10 lg:mb-12 px-2">
              <div className="relative group max-w-6xl mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-3xl blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/20 hover:border-white/30 transition-all duration-500 shadow-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {/* Location Input */}
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover/input:opacity-100 transition-all duration-300"></div>
                      <div className="relative flex items-center bg-white/95 hover:bg-white rounded-2xl px-4 py-4 sm:py-5 lg:py-6 h-14 sm:h-16 lg:h-20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-blue-200">
                        <MapPin className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <Input
                          placeholder="Enter location..."
                          value={searchData.location}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              location: e.target.value,
                            })
                          }
                          className="border-0 focus-visible:ring-0 text-gray-900 bg-transparent placeholder:text-gray-500 font-medium h-full"
                        />
                      </div>
                    </div>

                    {/* Property Type Select */}
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover/input:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-white/95 hover:bg-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-purple-200 h-14 sm:h-16 lg:h-20">
                        <Select
                          onValueChange={(value) =>
                            setSearchData({ ...searchData, type: value })
                          }
                        >
                          <SelectTrigger className="border-0 focus:ring-0 py-4 sm:py-5 lg:py-6 px-4 h-full font-medium text-gray-700">
                            <SelectValue placeholder="Property Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-2xl">
                            <SelectItem
                              value="sale"
                              className="font-medium py-3"
                            >
                              🏠 For Sale
                            </SelectItem>
                            <SelectItem
                              value="rent"
                              className="font-medium py-3"
                            >
                              🏢 For Rent
                            </SelectItem>
                            <SelectItem
                              value="bachelor"
                              className="font-medium py-3"
                            >
                              🏠 Bachelor
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Price Input */}
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover/input:opacity-100 transition-all duration-300"></div>
                      <div className="relative bg-white/95 hover:bg-white rounded-2xl px-4 py-4 sm:py-5 lg:py-6 h-14 sm:h-16 lg:h-20 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:border-emerald-200">
                        <Input
                          placeholder="Max Price (৳)"
                          type="number"
                          value={searchData.maxPrice}
                          onChange={(e) =>
                            setSearchData({
                              ...searchData,
                              maxPrice: e.target.value,
                            })
                          }
                          className="border-0 focus-visible:ring-0 text-gray-900 bg-transparent placeholder:text-gray-500 font-medium h-full"
                        />
                      </div>
                    </div>

                    {/* Search Button */}
                    <div className="sm:col-span-2 lg:col-span-1">
                      <Button
                        onClick={handleSearch}
                        size="lg"
                        className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 sm:py-5 lg:py-6 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-sm sm:text-base h-14 sm:h-16 lg:h-20"
                      >
                        <Search className="w-5 h-5 mr-2" />
                        Search Properties
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Call-to-Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-8 sm:mb-12 lg:mb-16 px-4">
              <Link href="/auth/register?role=seller" className="group">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-base sm:text-lg h-14 sm:h-16 flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-3" />
                  List Your Property
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>
              </Link>
              <Link href="/listings" className="group">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-2 border-white/40 text-white hover:bg-white hover:text-gray-900 backdrop-blur-xl bg-white/10 hover:bg-white/90 font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base sm:text-lg h-14 sm:h-16 flex items-center justify-center"
                >
                  <TrendingUp className="w-5 h-5 mr-3" />
                  Browse Properties
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pb-16 sm:pb-20 lg:pb-24 px-2">
              {[
                {
                  icon: Shield,
                  title: "Verified Listings",
                  description: "All properties verified with NID & documents",
                  gradient: "from-blue-500 to-cyan-500",
                  bgGradient: "from-blue-500/10 to-cyan-500/10",
                  borderGradient: "from-blue-400/30 to-cyan-400/30",
                },
                {
                  icon: CheckCircle,
                  title: "Trusted Platform",
                  description: "Secure payments & complaint system",
                  gradient: "from-emerald-500 to-green-500",
                  bgGradient: "from-emerald-500/10 to-green-500/10",
                  borderGradient: "from-emerald-400/30 to-green-400/30",
                },
                {
                  icon: Users,
                  title: "Expert Support",
                  description: "24/7 customer support & assistance",
                  gradient: "from-purple-500 to-pink-500",
                  bgGradient: "from-purple-500/10 to-pink-500/10",
                  borderGradient: "from-purple-400/30 to-pink-400/30",
                },
              ].map((badge, index) => (
                <div
                  key={index}
                  className={`group relative transition-all duration-500 hover:scale-105 h-full`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                    animation: isLoaded
                      ? "fadeInUp 0.8s ease-out forwards"
                      : "none",
                  }}
                >
                  <div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${badge.borderGradient} rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`}
                  ></div>
                  <div
                    className={`relative bg-gradient-to-br ${badge.bgGradient} backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/20 group-hover:border-white/40 transition-all duration-500 shadow-xl hover:shadow-2xl h-full flex flex-col`}
                  >
                    <div className="flex flex-col items-center space-y-4 sm:space-y-6 text-center flex-grow justify-center">
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${badge.gradient} rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl flex-shrink-0`}
                      >
                        <badge.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <div className="space-y-2 flex-grow flex flex-col justify-center">
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                          {badge.title}
                        </h3>
                        <p className="text-sm sm:text-base opacity-90 leading-relaxed max-w-xs mx-auto">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Wave Bottom */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          className="w-full h-16 sm:h-20 lg:h-24 fill-white"
          preserveAspectRatio="none"
        >
          <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          25% {
            transform: translateY(-20px) rotate(90deg);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.6;
          }
          75% {
            transform: translateY(-30px) rotate(270deg);
            opacity: 0.8;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25px);
          }
        }

        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes twinkle-delayed {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8) rotate(0deg);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1) rotate(180deg);
          }
        }

        @keyframes gradient-slow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-twinkle-delayed {
          animation: twinkle-delayed 3s ease-in-out infinite 1s;
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 6s ease infinite;
        }
      `}</style>
    </section>
  );
}
