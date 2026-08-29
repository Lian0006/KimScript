import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Camera, Play, Share, Twitter, Linkedin } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  bgColor: string;
  borderColor: string;
}

const platforms: Platform[] = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: <Video className="h-5 w-5" />,
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200"
  },
  {
    id: "instagram",
    name: "Instagram Reels",
    icon: <Camera className="h-5 w-5" />,
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  {
    id: "youtube",
    name: "YouTube Shorts",
    icon: <Play className="h-5 w-5" />,
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200"
  },
  {
    id: "facebook",
    name: "Facebook Reels",
    icon: <Share className="h-5 w-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  },
  {
    id: "twitter",
    name: "Twitter/X",
    icon: <Twitter className="h-5 w-5" />,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200"
  }
];

interface PlatformSelectorProps {
  selectedPlatforms: string[];
  onPlatformChange: (platforms: string[]) => void;
}

export default function PlatformSelector({ selectedPlatforms, onPlatformChange }: PlatformSelectorProps) {
  const togglePlatform = (platformId: string) => {
    const newSelection = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    
    onPlatformChange(newSelection);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Video className="h-5 w-5 text-violet-600" />
        <h3 className="text-lg font-semibold text-violet-800">Plataformas</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id);
          
          return (
            <Card
              key={platform.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected 
                  ? `${platform.bgColor} ${platform.borderColor} border-2 shadow-sm` 
                  : "bg-white border border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => togglePlatform(platform.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`${isSelected ? platform.color : "text-gray-400"}`}>
                      {platform.icon}
                    </div>
                    <span className={`font-medium ${
                      isSelected ? platform.color : "text-gray-600"
                    }`}>
                      {platform.name}
                    </span>
                  </div>
                  
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    isSelected 
                      ? "bg-blue-500 border-blue-500" 
                      : "border-gray-300"
                  }`}>
                    {isSelected && (
                      <span className="text-white text-xs">✓</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedPlatforms.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-sm text-gray-600">Seleccionadas:</span>
          {selectedPlatforms.map(platformId => {
            const platform = platforms.find(p => p.id === platformId);
            return platform ? (
              <Badge 
                key={platformId} 
                variant="secondary" 
                className="bg-violet-100 text-violet-700 border-violet-200"
              >
                {platform.name}
              </Badge>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}