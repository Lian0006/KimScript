import { useLanguage } from "@/contexts/LanguageContext";
import { Brain, Zap, Target, Users, TrendingUp, Clock } from "lucide-react";

export default function NeuroScienceSection() {
  const { t } = useLanguage();

  const neuroPrinciples = [
    {
      icon: Brain,
      title: t.psychologicalTriggers,
      description: t.authorityScarcitySocialProof,
      details: t.triggersDescription,
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: t.attentionEconomics,
      description: t.hookCaptureDescription,
      details: t.attentionDescription,
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Target,
      title: t.cognitiveLoadTheory,
      description: t.informationProcessingOptimization,
      details: t.cognitiveDescription,
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Users,
      title: t.socialPsychology,
      description: t.cialdiniPrinciples,
      details: t.socialDescription,
      color: "from-orange-500 to-red-500"
    },
    {
      icon: TrendingUp,
      title: t.behavioralEconomics,
      description: t.lossAversionAnchoring,
      details: t.behavioralDescription,
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Clock,
      title: t.memoryEncoding,
      description: t.primacyRecencyRepetition,
      details: t.memoryDescription,
      color: "from-teal-500 to-blue-500"
    }
  ];

  const frameworks = [
    {
      name: t.aidaFramework,
      description: t.aidaDescription,
      application: t.aidaApplication
    },
    {
      name: t.pasFramework, 
      description: t.pasDescription,
      application: t.pasApplication
    },
    {
      name: t.storytellingArc,
      description: t.storytellingDescription,
      application: t.storytellingApplication
    },
    {
      name: t.hookStoryCta,
      description: t.hookStoryDescription,
      application: t.hookStoryApplication
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t.neuroscienceOfViral}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            {t.neuroscienceDescription}
          </p>
        </div>

        {/* Neuro Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {neuroPrinciples.map((principle, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${principle.color} mb-4`}>
                <principle.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {principle.title}
              </h3>
              
              <p className="text-purple-600 font-semibold mb-3">
                {principle.description}
              </p>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                {principle.details}
              </p>
            </div>
          ))}
        </div>

        {/* Frameworks Section */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
            {t.provenFrameworks}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {frameworks.map((framework, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  {framework.name}
                </h4>
                <p className="text-purple-600 font-semibold mb-3">
                  {framework.description}
                </p>
                <p className="text-gray-600 text-sm">
                  {framework.application}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full">
              <Brain className="w-5 h-5" />
              <span className="font-semibold">{t.researchBackedResults}</span>
            </div>
            <p className="text-gray-600 mt-4 text-sm">
              {t.everyScriptOptimized}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
