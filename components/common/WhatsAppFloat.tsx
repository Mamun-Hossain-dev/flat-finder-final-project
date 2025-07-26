"use client";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WhatsAppFloat() {
  const whatsappNumber = "+8801640571091";

  const handleWhatsAppClick = (message = "") => {
    const encodedMessage = encodeURIComponent(
      message || "Hi! I need help with FlatFinder"
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(
      /[^\d]/g,
      ""
    )}?text=${encodedMessage}`;
    
    console.log("Attempting to open WhatsApp URL:", whatsappUrl); // Added for debugging
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Float button */}
      <div className="fixed bottom-6 right-4 z-50">
        <Button
          onClick={() => handleWhatsAppClick("Hi! I need help with FlatFinder")}
          size="lg"
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="Chat with us on WhatsApp" // Added for hover text
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </Button>

        {/* Notification badge */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">!</span>
        </div>

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-20 pointer-events-none"></div>
      </div>
    </>
  );
}