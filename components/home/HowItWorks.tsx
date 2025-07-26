import { Search, UserCheck, Home, Handshake } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search Properties",
      description:
        "Browse through thousands of verified listings or use our advanced search filters to find your perfect home.",
      color: "bg-blue-500",
    },
    {
      icon: UserCheck,
      title: "Get Verified",
      description:
        "Complete your profile verification with NID and phone number to ensure a trusted and secure experience.",
      color: "bg-green-500",
    },
    {
      icon: Home,
      title: "Book Visit",
      description:
        "Schedule property visits with a small appointment fee. For rentals, contact owners directly at no cost.",
      color: "bg-orange-500",
    },
    {
      icon: Handshake,
      title: "Close Deal",
      description:
        "Complete your transaction safely with our complaint system and review process for added security.",
      color: "bg-purple-500",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in just 4 simple steps and find your dream property
            today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="text-center group shadow-lg p-3 rounded-lg transition-transform  hover:shadow-xl"
              >
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  {/* <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div> */}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
