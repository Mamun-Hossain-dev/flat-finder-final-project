import {
  Shield,
  CheckCircle,
  Users,
  Award,
  Lock,
  HeartHandshake,
} from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: Shield,
      title: "Verified Listings",
      description: "All properties verified with NID & utility bills",
      stat: "100%",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: CheckCircle,
      title: "Trusted Users",
      description: "Phone & email verified members only",
      stat: "50K+",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Users,
      title: "Happy Customers",
      description: "Successful property transactions",
      stat: "10K+",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Premium property standards maintained",
      stat: "95%",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description: "Safe & transparent payment system",
      stat: "100%",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: HeartHandshake,
      title: "Customer Support",
      description: "24/7 dedicated customer assistance",
      stat: "24/7",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose FlatFinder?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your trusted partner in finding the perfect home with complete
            transparency and security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={index}
                className="group text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
                <div
                  className={`w-16 h-16 ${badge.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                >
                  <IconComponent className={`w-8 h-8 ${badge.color}`} />
                </div>

                <div className={`text-3xl font-bold ${badge.color} mb-2`}>
                  {badge.stat}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {badge.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
