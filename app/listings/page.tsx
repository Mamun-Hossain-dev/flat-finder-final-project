"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Bed, Bath, Ruler, Tag } from "lucide-react";

interface Listing {
  _id: string;
  title: string;
  description: string;
  images: string[];
  type: "sale" | "rent" | "bachelor" | "sold" | "rented";
  location: { area: string; city: string };
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  isPremium: boolean;
  ownerId: { name: string; email: string; phone: string };
  views: number;
  available: boolean;
  isApproved: boolean;
}

// eslint-disable-next-line react/display-name
const ListingsPage = memo(() => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    area: searchParams.get("area") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    isPremium: searchParams.get("isPremium") === "true",
  });

  const [cityInput, setCityInput] = useState(filters.city);
  const [areaInput, setAreaInput] = useState(filters.area);
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice);

  useEffect(() => {
    setCityInput(filters.city);
    setAreaInput(filters.area);
    setMaxPriceInput(filters.maxPrice);
  }, [filters.city, filters.area, filters.maxPrice]);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append("type", filters.type);
      if (filters.city) params.append("city", filters.city);
      if (filters.area) params.append("area", filters.area);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.isPremium) params.append("isPremium", "true");

      const response = await fetch(`/api/listings?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }
      const data = await response.json();
      setListings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (name: string, value: string | boolean | null) => {
    if (name === "city") {
      setCityInput(value as string);
    } else if (name === "area") {
      setAreaInput(value as string);
    } else if (name === "maxPrice") {
      setMaxPriceInput(value as string);
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.type) params.append("type", filters.type);
    if (filters.city) params.append("city", filters.city);
    if (filters.area) params.append("area", filters.area);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
    if (filters.isPremium) params.append("isPremium", "true");
    router.push(`/listings?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      city: "",
      area: "",
      maxPrice: "",
      isPremium: false,
    });
    router.push("/listings");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24">
      <h1 className="text-3xl font-bold mb-6">Available Listings</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Select
          onValueChange={(value) => handleFilterChange("type", value)}
          value={filters.type}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null as any}>All Types</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="bachelor">For Bachelor</SelectItem>
          </SelectContent>
        </Select>

        <Input
          placeholder="City"
          value={cityInput}
          onChange={(e) => handleFilterChange("city", e.target.value)}
        />
        <Input
          placeholder="Area"
          value={areaInput}
          onChange={(e) => handleFilterChange("area", e.target.value)}
        />
        <Input
          placeholder="Max Price"
          type="number"
          value={maxPriceInput}
          onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPremium"
            checked={filters.isPremium}
            onChange={(e) => handleFilterChange("isPremium", e.target.checked)}
            className="form-checkbox"
          />
          <Label htmlFor="isPremium">Premium Listings</Label>
        </div>
        <Button
          onClick={applyFilters}
          size="lg"
          className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-sm h-12 flex items-center justify-center"
        >
          Apply Filters
        </Button>
        <Button
          variant="outline"
          onClick={clearFilters}
          size="lg"
          className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white backdrop-blur-xl bg-transparent font-bold py-2 px-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm h-12 flex items-center justify-center"
        >
          Clear Filters
        </Button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">
          No listings found matching your criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Link href={`/listings/${listing._id}`} key={listing._id}>
              <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full h-48">
                  <Image
                    src={listing.images[0] || "/placeholder.jpg"}
                    alt={listing.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {listing.isPremium && (
                    <span className="absolute top-2 left-2 rounded-md bg-yellow-500 px-2 py-1 text-xs font-medium text-white z-10">
                      Premium
                    </span>
                  )}
                  {listing.type === "sold" && (
                    <span className="absolute top-2 right-2 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white z-10">
                      Sold
                    </span>
                  )}
                  {!listing.available && listing.type !== "sold" && (
                    <span className="absolute top-2 right-2 rounded-md bg-gray-600 px-2 py-1 text-xs font-medium text-white z-10">
                      Unavailable
                    </span>
                  )}
                  {(listing.type === "sold" || !listing.available) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-0"></div>
                  )}
                </div>
                <CardContent className="p-4">
                  <CardTitle className="text-xl font-semibold mb-2">
                    {listing.title}
                  </CardTitle>
                  <p className="text-gray-600 text-sm mb-2">
                    {listing.location.area}, {listing.location.city}
                  </p>
                  <div className="flex items-center justify-between text-gray-700 text-lg font-bold mb-3">
                    <span className="flex items-center">
                      ৳{listing.price.toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-1" />
                      {listing.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-gray-600 text-sm">
                    <span className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {listing.bedrooms} Beds
                    </span>
                    <span className="flex items-center">
                      <Bath className="w-4 h-4 mr-1" />
                      {listing.bathrooms} Baths
                    </span>
                    <span className="flex items-center">
                      <Ruler className="w-4 h-4 mr-1" />
                      {listing.size} sqft
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
});

export default ListingsPage;
