import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";

export default function UltraSimpleHero() {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4">
      <div className="w-full max-w-2xl text-center space-y-12">
        {/* Título gigante */}
        <div className="space-y-4">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900">
            KimScript
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            {t.heroSubtitle}
          </p>
        </div>

        {/* Input y botón */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
          <div className="space-y-6">
            <Input
              type="url"
              placeholder={t.urlPlaceholder}
              value={videoUrl}
              onChange={handleUrlChange}
              onKeyPress={handleKeyPress}
              className={`text-lg h-14 px-6 ${
                videoUrl && isValid 
                  ? 'border-green-500 bg-green-50' 
                  : videoUrl && !isValid 
                  ? 'border-red-500 bg-red-50' 
                  : ''
              }`}
            />
            
            <Button
              onClick={handleAnalyze}
              disabled={!isValid}
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isValid ? t.analyzeButton : t.urlPlaceholder}
            </Button>
          </div>
        </Card>

        {/* Indicador de validación */}
        {videoUrl && (
          <div className="flex items-center justify-center space-x-2">
            {isValid ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">{t.validUrl}</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-600 font-medium">{t.invalidUrl}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
