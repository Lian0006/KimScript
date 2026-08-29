import { useLanguage } from "@/contexts/LanguageContext";

export default function UltraSimpleSteps() {
  const { t } = useLanguage();
  
  const steps = [
    {
      icon: "🔗",
      title: t.step1Title,
      description: t.step1Description
    },
    {
      icon: "🤖",
      title: t.step2Title,
      description: t.step2Description
    },
    {
      icon: "📄",
      title: t.step3Title,
      description: t.step3Description
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
          {t.howItWorks}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="text-6xl mb-4">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
