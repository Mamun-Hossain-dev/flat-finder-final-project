import Link from "next/link";
import {
  Home,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Buy Flats", href: "/listings?type=sale" },
    { name: "Rent Flats", href: "/listings?type=rent" },
    { name: "Bachelor Flats", href: "/listings?type=bachelor" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Contact Us", href: "/contact" },
  ];

  const legalLinks = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "FAQ", href: "/faq" },
    { name: "Complaint Policy", href: "/complaint-policy" },
    { name: "Refund Policy", href: "/refund-policy" },
  ];

  const paymentMethods = [
    { name: "bKash", logo: "/images/bkash-logo.png" },
    { name: "Nagad", logo: "/images/nagad-logo.png" },
    { name: "Rocket", logo: "/images/rocket-logo.png" },
    { name: "Bank Transfer", logo: "/images/bank-logo.png" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">FlatFinder</span>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Bangladesh&apos;s most trusted platform for buying, selling, and
              renting properties. Find your dream home with complete
              transparency and security.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4" />
                <span>House 123, Road 12, Dhanmondi, Dhaka 1209</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="w-4 h-4" />
                <span>+880-1234-567890</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="w-4 h-4" />
                <span>info@flatfinder.com.bd</span>
              </div>
            </div>

            {/* Social media links */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-gray-400">Follow us:</span>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="border-t border-gray-800 mt-8 pt-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold mb-3 md:mb-0">
              Accepted Payment Methods
            </h4>
            <div className="flex items-center space-x-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="px-3 py-2 bg-white rounded text-gray-900 text-xs font-medium"
                >
                  {method.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>© {currentYear} FlatFinder Bangladesh. All rights reserved.</p>
            <p>Made with ❤️ for the people of Bangladesh</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
