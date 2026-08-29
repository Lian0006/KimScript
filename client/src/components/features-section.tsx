import { Brain, Rocket, Target, History, Shield, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const features = [
  {
    icon: Brain,
    titleKey: "feature1Title" as const,
    descriptionKey: "feature1Description" as const,
    gradient: "from-violet-500 to-blue-600",
    iconBg: "bg-gradient-to-br from-violet-500 to-blue-600",
    delay: "0ms"
  },
  {
    icon: Rocket,
    titleKey: "feature2Title" as const,
    descriptionKey: "feature2Description" as const,
    gradient: "from-blue-500 to-violet-600",
    iconBg: "bg-gradient-to-br from-blue-500 to-violet-600",
    delay: "200ms"
  },
  {
    icon: Target,
    titleKey: "feature3Title" as const,
    descriptionKey: "feature3Description" as const,
    gradient: "from-violet-600 to-blue-500",
    iconBg: "bg-gradient-to-br from-violet-600 to-blue-500",
    delay: "400ms"
  },
  {
    icon: History,
    title: "Script Library",
    description: "Access all your generated scripts anytime with our organized content history system",
    gradient: "from-blue-600 to-violet-500",
    iconBg: "bg-gradient-to-br from-blue-600 to-violet-500",
    delay: "600ms"
  },
  {
    icon: Shield,
    title: "Free & Secure",
    description: "No credit card required. Your data and scripts are always kept private and secure",
    gradient: "from-violet-500 to-blue-400",
    iconBg: "bg-gradient-to-br from-violet-500 to-blue-400",
    delay: "800ms"
  },
  {
    icon: TrendingUp,
    title: "Viral Insights",
    description: "Learn what makes content go viral with detailed breakdowns of successful video elements",
    gradient: "from-blue-400 to-violet-600",
    iconBg: "bg-gradient-to-br from-blue-400 to-violet-600",
    delay: "1000ms"
  }
];

export default function FeaturesSection() {
  const { t } = useLanguage();

  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose KimScript?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI-powered platform combines cutting-edge technology with marketing expertise to help you create viral content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              {/* Main card */}
              <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 h-full border border-gray-100">
                {/* Icon container */}
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-full ${feature.iconBg} flex items-center justify-center shadow-sm`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.titleKey ? t[feature.titleKey] : feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.descriptionKey ? t[feature.descriptionKey] : feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
