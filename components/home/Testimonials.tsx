"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Ahmed Rahman",
      role: "Property Buyer",
      location: "Dhaka",
      rating: 5,
      comment:
        "FlatFinder made buying my first apartment so easy! The verification process gave me confidence, and the appointment system saved me time. Highly recommended!",
      image: "/images/testimonial-1.jpg",
    },
    {
      id: 2,
      name: "Fatima Khatun",
      role: "Property Owner",
      location: "Chittagong",
      rating: 5,
      comment:
        "As a property owner, I love how FlatFinder attracts serious buyers. The premium listing feature really helped my property stand out. Great platform!",
      image: "/images/testimonial-2.jpg",
    },
    {
      id: 3,
      name: "Mohammad Ali",
      role: "Tenant",
      location: "Sylhet",
      rating: 5,
      comment:
        "Finding a bachelor flat was never this easy. The search filters are amazing and I could contact landlords directly. Saved both time and money!",
      image: "/images/testimonial-3.jpg",
    },
    {
      id: 4,
      name: "Rashida Begum",
      role: "Family Tenant",
      location: "Rajshahi",
      rating: 5,
      comment:
        "The complaint system gives me peace of mind. When I had an issue with a listing, the admin team resolved it quickly. Truly trustworthy!",
      image: "/images/testimonial-4.jpg",
    },
    {
      id: 5,
      name: "Karim Ahmed",
      role: "Property Investor",
      location: "Dhaka",
      rating: 5,
      comment:
        "I've used many property platforms, but FlatFinder's verification system is unmatched. The quality of listings is consistently high.",
      image: "/images/testimonial-5.jpg",
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight">
            Loved by Users Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from thousands of
            satisfied property owners and seekers.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <Card className="relative overflow-hidden bg-white/60 backdrop-blur-xl border-0 shadow-2xl shadow-indigo-500/20 rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0.5, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0.5, x: -50 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <CardContent className="p-8 md:p-12 lg:p-16 text-center">
                  <div className="flex-shrink-0 mb-6">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                      {testimonials[currentSlide].name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <Quote className="w-10 h-10 text-blue-500 mb-4 mx-auto" />

                    <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed min-h-[112px]">
                      {`"${testimonials[currentSlide].comment}"`}
                    </p>

                    <div className="flex items-center justify-center space-x-1 mb-4">
                      {renderStars(testimonials[currentSlide].rating)}
                    </div>

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {testimonials[currentSlide].name}
                      </h4>
                      <p className="text-gray-500">
                        {testimonials[currentSlide].role} •{" "}
                        {testimonials[currentSlide].location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={prevSlide}
              className="absolute top-1/2 -translate-y-1/2 left-4 h-12 w-12 rounded-full bg-white/50 shadow-md hover:bg-white/90 text-gray-600 hover:text-gray-900 transition-all duration-300"
            >
              <ChevronLeft className="w-7 h-7" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextSlide}
              className="absolute top-1/2 -translate-y-1/2 right-4 h-12 w-12 rounded-full bg-white/50 shadow-md hover:bg-white/90 text-gray-600 hover:text-gray-900 transition-all duration-300"
            >
              <ChevronRight className="w-7 h-7" />
            </Button>

            {/* Dots indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-blue-600 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Card>
        </div>

        {/* Additional testimonials grid for larger screens */}
        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {testimonials.slice(0, 3).map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-white/50 backdrop-blur-md shadow-lg shadow-indigo-500/10 hover:shadow-xl hover:shadow-indigo-500/20 transition-shadow duration-300 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h5>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {`"${testimonial.comment.slice(0, 120)}..."`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
