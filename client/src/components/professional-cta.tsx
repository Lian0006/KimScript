import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight, Check, Zap } from "lucide-react";

export default function ProfessionalCTA() {
  const { t } = useLanguage();

  const benefits = [
    t.noCreditCardRequired,
    t.startCreatingIn30Seconds,
    t.unlimitedVideoAnalysis,
    t.exportToAnyFormat,
    t.aiSupport247
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-purple-300" />
            <span className="text-purple-200 text-sm font-medium">{t.limitedTimeOffer}</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t.readyToGoViral}
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            {t.joinThousandsUsingAI}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Benefits */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t.whatYouGet}
              </h3>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-200 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                <p className="text-green-200 text-sm">
                  <strong>{t.freeForever}</strong> - {t.noHiddenFees}
                </p>
              </div>
            </div>

            {/* Right Side - CTA */}
            <div className="text-center lg:text-left">
              <div className="bg-white rounded-2xl p-8 shadow-2xl">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  {t.startCreatingNow}
                </h4>
                
                <p className="text-gray-600 mb-6">
                  {t.getInstantAccess}
                </p>

                <div className="space-y-4">
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center gap-2 text-lg"
                  >
                    {t.getStartedFree}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  
                  <p className="text-sm text-gray-500">
                    {t.takesLessThan30Seconds}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm mb-6">{t.trustedByCreatorsAt}</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-lg font-semibold text-white">TikTok</div>
            <div className="text-lg font-semibold text-white">Instagram</div>
            <div className="text-lg font-semibold text-white">YouTube</div>
            <div className="text-lg font-semibold text-white">LinkedIn</div>
            <div className="text-lg font-semibold text-white">Twitter</div>
          </div>
        </div>
      </div>
    </div>
  );
}
