import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, Camera, Play, Share, Twitter, Linkedin, ArrowRight, ArrowLeft, Settings } from "lucide-react";
import DashboardLayout from "@/components/dashboard-layout";
import { Link } from "wouter";

interface Platform {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  bgColor: string;
  borderColor: string;
  selectedBg: string;
  selectedBorder: string;
}

const platforms: Platform[] = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: <Video className="h-5 w-5" />,
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    selectedBg: "bg-pink-100",
    selectedBorder: "border-pink-400"
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    icon: <Camera className="h-5 w-5" />,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    selectedBg: "bg-purple-100",
    selectedBorder: "border-purple-400"
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    icon: <Play className="h-5 w-5" />,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    selectedBg: "bg-red-100",
    selectedBorder: "border-red-400"
  },
  {
    id: "facebook",
    name: "Facebook Reels",
    icon: <Share className="h-5 w-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    selectedBg: "bg-blue-100",
    selectedBorder: "border-blue-400"
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: <Twitter className="h-5 w-5" />,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    selectedBg: "bg-gray-100",
    selectedBorder: "border-gray-400"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    selectedBg: "bg-blue-100",
    selectedBorder: "border-blue-400"
  }
];

export default function Platforms() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['tiktok', 'instagram']);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "No autorizado",
        description: "Debes iniciar sesión para acceder a esta página. Redirigiendo...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleContinue = () => {
    if (selectedPlatforms.length === 0) {
      toast({
        title: "Selecciona al menos una plataforma",
        description: "Necesitas elegir al menos una plataforma para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Store selected platforms and redirect to dashboard
    localStorage.setItem('selectedPlatforms', JSON.stringify(selectedPlatforms));
    window.location.href = '/dashboard';
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </Button>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Configurar Plataformas</h1>
              <p className="text-gray-600 text-lg">Elige las plataformas donde quieres optimizar tu contenido viral</p>
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-6">
            <Video className="h-6 w-6 text-violet-600" />
            <h2 className="text-xl font-semibold text-violet-800">Plataformas</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => {
              const isSelected = selectedPlatforms.includes(platform.id);
              
              return (
                <Card
                  key={platform.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                    isSelected 
                      ? `${platform.selectedBg} ${platform.selectedBorder} border-2 shadow-md` 
                      : "bg-white border border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => togglePlatform(platform.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? platform.bgColor : "bg-gray-100"
                        }`}>
                          <div className={`${isSelected ? platform.color : "text-gray-400"}`}>
                            {platform.icon}
                          </div>
                        </div>
                        <div>
                          <span className={`font-semibold text-lg ${
                            isSelected ? platform.color : "text-gray-600"
                          }`}>
                            {platform.name}
                          </span>
                        </div>
                      </div>
                      
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? "bg-blue-500 border-blue-500 scale-110" 
                          : "border-gray-300"
                      }`}>
                        {isSelected && (
                          <span className="text-white text-sm">✓</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {/* Selected Platforms Summary */}
          {selectedPlatforms.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200">
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Plataformas seleccionadas:</span>
                  {selectedPlatforms.map(platformId => {
                    const platform = platforms.find(p => p.id === platformId);
                    return platform ? (
                      <Badge 
                        key={platformId} 
                        className="bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-200"
                      >
                        {platform.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Continue Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={selectedPlatforms.length === 0}
            >
              Continuar al Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}