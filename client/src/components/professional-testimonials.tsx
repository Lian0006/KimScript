import { useLanguage } from "@/contexts/LanguageContext";
import { Star, Quote } from "lucide-react";

export default function ProfessionalTestimonials() {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      company: "TechTok",
      avatar: "SC",
      content: "The neuro-psychological analysis is incredible. KimScript identified exactly which dopamine triggers were missing from my content. Went from 10K to 500K followers in 3 months.",
      rating: 5,
      platform: "TikTok"
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      company: "BrandCo",
      avatar: "MR",
      content: "The 6 psychological triggers framework changed everything. Our engagement rates increased 300% by implementing authority and scarcity triggers in our scripts.",
      rating: 5,
      platform: "Instagram"
    },
    {
      name: "Emily Johnson",
      role: "Social Media Manager",
      company: "StartupXYZ",
      avatar: "EJ",
      content: "Finally, a tool that understands the science behind viral content. The attention economics principles (0.6s hooks, sub-hooks every 6-10s) work perfectly.",
      rating: 5,
      platform: "YouTube"
    },
    {
      name: "David Kim",
      role: "Influencer",
      company: "Lifestyle Brand",
      avatar: "DK",
      content: "The cognitive load optimization is amazing. My audience retention increased 250% because the scripts match how brains actually process information.",
      rating: 5,
      platform: "TikTok"
    },
    {
      name: "Lisa Wang",
      role: "Content Strategist",
      company: "Digital Agency",
      avatar: "LW",
      content: "Our clients love the scientific approach. KimScript's behavioral economics insights (loss aversion, anchoring) have become essential to our strategy.",
      rating: 5,
      platform: "Multi-Platform"
    },
    {
      name: "Alex Thompson",
      role: "Entrepreneur",
      company: "E-commerce",
      avatar: "AT",
      content: "The Cialdini principles integration is brilliant. We've seen 400% increase in conversions by leveraging reciprocity and social proof triggers.",
      rating: 5,
      platform: "Instagram"
    }
  ];

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.trustedByCreatorsTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.seeHowCreators} <span className="font-semibold text-purple-600">{t.neuroscienceBackedAI}</span> {t.toScaleViral}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-xs text-purple-600 font-medium">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-sm text-gray-600">{testimonial.platform}</span>
              </div>

              <div className="relative">
                <Quote className="w-6 h-6 text-purple-200 absolute -top-2 -left-2" />
                <p className="text-gray-700 leading-relaxed pl-4">
                  "{testimonial.content}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10K+</div>
              <div className="text-purple-100">{t.activeUsers}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-purple-100">{t.scriptsGenerated}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">95%</div>
              <div className="text-purple-100">{t.successRate}</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-purple-100">{t.userRating}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
