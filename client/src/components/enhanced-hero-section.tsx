import { Button } from "@/components/ui/button";
import { Check, Sparkles, TrendingUp, Zap, Play, Users, Clock, Star, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

export default function EnhancedHeroSection() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [animationStep, setAnimationStep] = useState(0);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [stats, setStats] = useState({
    scriptsGenerated: 1247,
    activeUsers: 89,
    avgViralScore: 87
  });

  // Simular estadísticas en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        scriptsGenerated: prev.scriptsGenerated + Math.floor(Math.random() * 3),
        activeUsers: prev.activeUsers + (Math.random() > 0.7 ? 1 : 0),
        avgViralScore: Math.min(99, prev.avgViralScore + (Math.random() > 0.5 ? 1 : -1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationStep(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = "/";
    } else {
      window.location.href = "/login";
    }
  };

  const handleTryDemo = () => {
    setIsDemoPlaying(true);
    setTimeout(() => setIsDemoPlaying(false), 8000);
  };

  return (
    <section className="relative bg-gradient-to-br from-violet-50 via-white to-blue-50 py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-violet-100 to-blue-100 rounded-full text-sm font-medium text-violet-700 border border-violet-200">
              <Sparkles className="h-4 w-4 mr-2" />
              +2,500 scripts generados esta semana
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
                Crea Scripts
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent"> Virales</span>
                <br />
                en Segundos
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                IA avanzada + Neuro-marketing = Contenido que se vuelve viral automáticamente
              </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-6 py-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-600">{stats.scriptsGenerated.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Scripts Generados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.activeUsers}</div>
                <div className="text-sm text-gray-500">Usuarios Activos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.avgViralScore}%</div>
                <div className="text-sm text-gray-500">Score Viral Promedio</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={handleGetStarted}
              >
                <Zap className="h-5 w-5 mr-2" />
                Comenzar Gratis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-violet-200 text-violet-600 hover:border-violet-300 hover:bg-violet-50"
                onClick={handleTryDemo}
              >
                <Play className="h-5 w-5 mr-2" />
                Ver Demo Interactivo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>100% Gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500" />
                <span>Resultados en 30 segundos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>4.9/5 (2,500+ reseñas)</span>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive Demo */}
          <div className="relative">
            {/* Main Demo Container */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative overflow-hidden border border-gray-100">
              {/* Demo Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm font-medium text-gray-600">Demo Interactivo</div>
              </div>

              {/* Demo Content */}
              <div className="space-y-6">
                {/* Input Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Pega tu URL de video:</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-white rounded-lg px-3 py-2 text-sm text-gray-500 border">
                      https://tiktok.com/@usuario/video/123...
                    </div>
                    <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
                      <Zap className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Analysis Results */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 transform transition-all duration-1000 ${
                    animationStep === 0 ? 'scale-105 shadow-lg' : 'scale-100'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-medium text-red-700">TikTok</span>
                      </div>
                      <TrendingUp className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="text-xs text-red-600 mb-2">Análisis de Hook</div>
                    <div className="text-sm font-semibold text-red-800 mb-2">
                      "¿Sabías que puedes ganar $500 al día?"
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <div className="text-xs text-red-700 font-bold">Viral Score: 94%</div>
                    </div>
                  </div>

                  <div className={`bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 transform transition-all duration-1000 ${
                    animationStep === 1 ? 'scale-105 shadow-lg' : 'scale-100'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                        <span className="text-xs font-medium text-pink-700">Instagram</span>
                      </div>
                      <Users className="h-4 w-4 text-pink-600" />
                    </div>
                    <div className="text-xs text-pink-600 mb-2">Engagement Pattern</div>
                    <div className="text-sm font-semibold text-pink-800 mb-2">
                      Storytelling + CTA emocional
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <div className="text-xs text-pink-700 font-bold">Engagement: 18.2%</div>
                    </div>
                  </div>

                  <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 transform transition-all duration-1000 ${
                    animationStep === 2 ? 'scale-105 shadow-lg' : 'scale-100'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-medium text-blue-700">YouTube</span>
                      </div>
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="text-xs text-blue-600 mb-2">Script Framework</div>
                    <div className="text-sm font-semibold text-blue-800 mb-2">
                      Framework AIDA + Neuro-marketing
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <div className="text-xs text-blue-700 font-bold">CTR: 12.4%</div>
                    </div>
                  </div>

                  <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 transform transition-all duration-1000 ${
                    animationStep === 3 ? 'scale-105 shadow-lg' : 'scale-100'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium text-green-700">AI Script</span>
                      </div>
                      <Sparkles className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="text-xs text-green-600 mb-2">Script Generado</div>
                    <div className="text-sm font-semibold text-green-800 mb-2">
                      Script personalizado listo
                    </div>
                    <div className="bg-white/50 rounded-lg p-2">
                      <div className="text-xs text-green-700 font-bold">Potencial: 96%</div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  <Button 
                    className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700 shadow-lg"
                    onClick={handleTryDemo}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isDemoPlaying ? 'Generando...' : 'Probar Demo Ahora'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-violet-400 to-blue-400 rounded-full opacity-20 animate-float"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-pink-400 to-violet-400 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
