import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, Zap, Download, Shield, Clock, Target } from "lucide-react";

export default function ProfessionalFeatures() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t.neuroPsychologicalAnalysis,
      description: t.neuroAnalysisDescription,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: t.behavioralTriggerOptimization,
      description: t.behavioralDescription,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Target,
      title: t.cognitiveLoadOptimization,
      description: t.cognitiveDescription,
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Download,
      title: t.scientificFrameworkExport,
      description: t.scientificDescription,
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: t.researchBackedMethods,
      description: t.researchDescription,
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Clock,
      title: t.realTimeNeuroAnalysis,
      description: t.realTimeDescription,
      color: "from-teal-500 to-blue-500"
    }
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.scienceBehindViral}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t.scienceDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 h-full">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t.readyToCreateFirstScript}
            </h3>
            <p className="text-gray-600 mb-6">
              {t.joinThousandsCreators}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.location.href = '/login'}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
              >
                {t.getStartedFree}
              </button>
              <button 
                onClick={() => window.location.href = '/#features'}
                className="px-8 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                {t.learnMore}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
