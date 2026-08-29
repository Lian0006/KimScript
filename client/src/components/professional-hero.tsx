import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Play, Zap, TrendingUp, Users, Clock, Check, Brain } from "lucide-react";

export default function ProfessionalHero() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const validateUrl = (url: string) => {
    const validDomains = ['tiktok.com', 'instagram.com', 'youtube.com', 'youtu.be'];
    return validDomains.some(domain => url.includes(domain));
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setVideoUrl(url);
    setIsValid(validateUrl(url));
  };

  const handleAnalyze = () => {
    if (isValid && videoUrl) {
      if (isAuthenticated) {
        window.location.href = `/analyze?url=${encodeURIComponent(videoUrl)}`;
      } else {
        window.location.href = `/login?redirect=/analyze&url=${encodeURIComponent(videoUrl)}`;
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">{t.neuroPsychologyBadge}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t.transformVideosInto}
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t.viralScripts}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t.heroDescription}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              <div className="flex items-center gap-2 text-gray-300">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">10K+</span>
                <span className="text-gray-400">{t.creators}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">95%</span>
                <span className="text-gray-400">{t.successRate}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Clock className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">30s</span>
                <span className="text-gray-400">{t.analysisTime}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">6</span>
                <span className="text-gray-400">{t.neuroTriggers}</span>
              </div>
            </div>
          </div>

          {/* Main CTA Section */}
          <Card className="p-8 bg-white/95 backdrop-blur-sm border-0 shadow-2xl max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.startCreatingViralContent}</h2>
                <p className="text-gray-600">{t.pasteVideoUrlDescription}</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://www.tiktok.com/@user/video/..."
                    value={videoUrl}
                    onChange={handleUrlChange}
                    onKeyPress={handleKeyPress}
                    className={`text-lg h-14 px-6 pr-12 ${
                      videoUrl && isValid 
                        ? 'border-green-500 bg-green-50' 
                        : videoUrl && !isValid 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-gray-300'
                    }`}
                  />
                  {videoUrl && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      {isValid ? (
                        <Check className="w-6 h-6 text-green-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleAnalyze}
                  disabled={!isValid}
                  size="lg"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5 mr-2" />
                  {isValid ? t.analyzeVideoGenerateScript : t.enterValidVideoUrl}
                </Button>
              </div>

              {/* Platform Support */}
              <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">TikTok</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                  <span className="text-sm font-medium">Instagram</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                  <span className="text-sm font-medium">YouTube</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Trust Indicators */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm mb-4">{t.trustedByCreators}</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-white">TikTok</div>
              <div className="text-2xl font-bold text-white">Instagram</div>
              <div className="text-2xl font-bold text-white">YouTube</div>
              <div className="text-2xl font-bold text-white">LinkedIn</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
