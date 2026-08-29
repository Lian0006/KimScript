import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [animationStep, setAnimationStep] = useState(0);
  const [floatingElements, setFloatingElements] = useState([
    { id: 1, x: 20, y: 30, delay: 0 },
    { id: 2, x: 80, y: 20, delay: 1 },
    { id: 3, x: 15, y: 70, delay: 2 },
    { id: 4, x: 85, y: 80, delay: 3 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      document.getElementById('analysis-form')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = "/login";
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                  {t.heroTitle}
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-violet-600 font-semibold">
                {t.heroSubtitle}
              </p>
              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
                {t.heroDescription}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700 shadow-lg"
                onClick={handleGetStarted}
              >
                {t.getStarted}
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-violet-200 text-violet-600 hover:border-violet-300 hover:bg-violet-50"
              >
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Instant results</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Subtle Floating Background Elements */}
            {floatingElements.map((element, index) => (
              <div
                key={element.id}
                className={`absolute w-8 h-8 rounded-full opacity-10 animate-float`}
                style={{
                  left: `${element.x}%`,
                  top: `${element.y}%`,
                  animationDelay: `${element.delay * 2}s`,
                  animationDuration: '6s',
                  background: index % 2 === 0 
                    ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' 
                    : 'linear-gradient(135deg, #8B5CF6, #3B82F6)'
                }}
              />
            ))}

            {/* Main Analysis Dashboard */}
            <div className="bg-gradient-to-br from-primary/10 via-white to-secondary/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
              {/* Animated Grid Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className="border border-blue-300 animate-pulse"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div className={`bg-white rounded-lg p-4 shadow-lg transform transition-all duration-1000 ${
                  animationStep === 0 ? 'scale-105 shadow-xl' : 'scale-100'
                } hover:scale-105 hover:shadow-xl`}>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-600">TikTok</span>
                    <Sparkles className="h-3 w-3 ml-auto text-red-500" />
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Viral Hook Analysis</div>
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    "¿Sabías que puedes ganar $500 al día?"
                  </div>
                  <div className="mt-2 h-12 bg-gradient-to-r from-red-100 to-red-200 rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-slide"></div>
                    <div className="absolute bottom-1 left-2 text-xs text-red-700 font-semibold">
                      Hook Score: 92%
                    </div>
                  </div>
                </div>

                <div className={`bg-white rounded-lg p-4 shadow-lg transform transition-all duration-1000 ${
                  animationStep === 1 ? 'scale-105 shadow-xl' : 'scale-100'
                } hover:scale-105 hover:shadow-xl`}>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-600">Instagram</span>
                    <TrendingUp className="h-3 w-3 ml-auto text-pink-500" />
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Engagement Patterns</div>
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    Storytelling + CTA emocional
                  </div>
                  <div className="mt-2 h-12 bg-gradient-to-r from-pink-100 to-pink-200 rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-slide"></div>
                    <div className="absolute bottom-1 left-2 text-xs text-pink-700 font-semibold">
                      Engagement: 15.3%
                    </div>
                  </div>
                </div>

                <div className={`bg-white rounded-lg p-4 shadow-lg transform transition-all duration-1000 ${
                  animationStep === 2 ? 'scale-105 shadow-xl' : 'scale-100'
                } hover:scale-105 hover:shadow-xl`}>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-600">YouTube</span>
                    <Zap className="h-3 w-3 ml-auto text-blue-500" />
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Script Framework</div>
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    Framework AIDA adaptado
                  </div>
                  <div className="mt-2 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-slide"></div>
                    <div className="absolute bottom-1 left-2 text-xs text-blue-700 font-semibold">
                      CTR: 8.7%
                    </div>
                  </div>
                </div>

                <div className={`bg-white rounded-lg p-4 shadow-lg transform transition-all duration-1000 ${
                  animationStep === 3 ? 'scale-105 shadow-xl' : 'scale-100'
                } hover:scale-105 hover:shadow-xl`}>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-xs font-medium text-gray-600">AI Analysis</span>
                    <Sparkles className="h-3 w-3 ml-auto text-green-500" />
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Generated Script</div>
                  <div className="text-xs text-gray-700 mb-2 font-medium">
                    Script personalizado generado
                  </div>
                  <div className="mt-2 h-12 bg-gradient-to-r from-green-100 to-green-200 rounded relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-slide"></div>
                    <div className="absolute bottom-1 left-2 text-xs text-green-700 font-semibold">
                      Potencial: 94%
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center relative z-10">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                  Framework Neurológico AIDA
                  <div className="ml-2 w-2 h-2 bg-white rounded-full animate-ping"></div>
                </div>
              </div>
            </div>

            {/* Subtle Enhanced Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10 animate-float hover:opacity-15 transition-opacity duration-500"></div>
            <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full opacity-10 animate-float hover:opacity-15 transition-opacity duration-500"></div>
            
            {/* Gentle Dynamic Elements */}
            <div className="absolute top-1/2 -left-6 w-6 h-6 bg-violet-400 rounded-full opacity-15 animate-float" style={{ animationDelay: '3s', animationDuration: '8s' }}></div>
            <div className="absolute top-1/4 -right-4 w-4 h-4 bg-blue-400 rounded-full opacity-15 animate-float" style={{ animationDelay: '6s', animationDuration: '10s' }}></div>
            <div className="absolute bottom-1/3 -left-4 w-8 h-8 bg-pink-400 rounded-full opacity-15 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
