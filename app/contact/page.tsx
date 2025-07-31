"use client";
import { useState } from "react";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function ContactSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const WEB3FORMS_ACCESS_KEY = "f28ee327-2198-4f06-85f3-fafa4bd47ecb"; // Consider moving to .env

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
    if (errors.service) {
      setErrors((prev) => ({ ...prev, service: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("access_key", WEB3FORMS_ACCESS_KEY);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("service", formData.service || "Not specified");
      formDataToSend.append("message", formData.description);
      formDataToSend.append(
        "subject",
        `New Contact Form Submission from ${formData.name}`
      );

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({
          type: "success",
          text: "Thank you for your message! We'll get back to you soon.",
        });
        setFormData({
          name: "",
          email: "",
          service: "",
          description: "",
        });
      } else {
        setMessage({
          type: "error",
          text: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setMessage({
        type: "error",
        text: "Failed to send message. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-sky-500" },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: Linkedin,
      href: "#",
      label: "LinkedIn",
      color: "hover:text-blue-700",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Lets Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">Conversation</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ready to discuss your property needs? Fill out the form and our
                team will get back to you soon.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <Mail className="text-orange-500" size={24} />,
                  title: "Email Us",
                  detail: "info@flatfinderbd.com",
                  href: "mailto:info@flatfinderbd.com",
                },
                {
                  icon: <Phone className="text-orange-500" size={24} />,
                  title: "Call Us",
                  detail: "+880 1XXXXXXXXX",
                  href: "tel:+880 1XXXXXXXXX",
                },
                {
                  icon: <MapPin className="text-orange-500" size={24} />,
                  title: "Visit Us",
                  detail: "[Your FlatFinder BD Address], Dhaka, Bangladesh",
                  href: "#", // Placeholder, remove if no specific map link
                },
              ].map((contact, index) => (
                <Card
                  key={index}
                  className="p-4 flex items-start space-x-4 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex-shrink-0 mt-1">{contact.icon}</div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {contact.title}
                    </CardTitle>
                    <p className="text-gray-600 mt-1">{contact.detail}</p>
                    
                  </div>
                </Card>
              ))}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={social.href}
                      aria-label={social.label}
                      className={`w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 ${social.color} transition-all duration-300 hover:scale-110`}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            </div>

            <Card className="p-6 shadow-lg">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 text-gray-600">
                  {[
                    {
                      day: "Monday - Friday",
                      hours: "9:00 AM - 6:00 PM",
                    },
                    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
                    { day: "Sunday", hours: "Closed" },
                  ].map((schedule, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{schedule.day}</span>
                      <span>{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Form */}
          <Card className="p-8 lg:p-10 shadow-2xl">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="text-3xl font-bold text-gray-900">
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {message.text && (
                <Alert
                  className={`mb-6 ${
                    message.type === "success"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-red-50 border-red-200 text-red-800"
                  }`}
                >
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="service">Service Interest (Optional)</Label>
                  <Select
                    onValueChange={handleSelectChange}
                    value={formData.service}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="property-inquiry">
                        Property Inquiry
                      </SelectItem>
                      <SelectItem value="seller-support">
                        Seller Support
                      </SelectItem>
                      <SelectItem value="general-feedback">
                        General Feedback
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Tell us about your property needs, questions, or feedback..."
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  size="lg"
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0 text-base sm:text-lg h-14 sm:h-16 flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send size={20} />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
