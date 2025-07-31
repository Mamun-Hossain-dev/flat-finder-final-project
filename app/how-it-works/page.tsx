"use client";

import { Search, DollarSign, Key, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Search className="w-12 h-12 text-blue-600" />,
      title: "Find Your Perfect Flat",
      description:
        "Browse through a wide range of verified listings for sale, rent, or bachelor accommodation. Use our powerful filters to narrow down your search.",
    },
    {
      icon: <DollarSign className="w-12 h-12 text-green-600" />,
      title: "Connect with Owners",
      description:
        "Once you find a suitable flat, easily connect with the verified owner. Schedule visits or ask questions directly through our platform.",
    },
    {
      icon: <Key className="w-12 h-12 text-yellow-600" />,
      title: "Secure Your Deal",
      description:
        "Negotiate terms and finalize your agreement directly with the owner. We provide a transparent process to help you secure your new home.",
    },
    {
      icon: <CheckCircle className="w-12 h-12 text-purple-600" />,
      title: "Move In & Enjoy",
      description:
        "After successful agreement, move into your new flat and start enjoying your new living space. Our support team is always here to help.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          How FlatFinder Works
        </h1>
        <p className="text-lg text-gray-600">
          Our simple process helps you find your ideal flat with ease and confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105"
          >
            <div className="mb-6">{step.icon}</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">
              {step.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to find your flat?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Start browsing our extensive collection of verified listings today.
        </p>
        <Link href="/listings" className="flex justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 text-sm h-12 flex items-center justify-center"
          >
            Browse Listings
          </Button>
        </Link>
      </div>
    </div>
  );
}
