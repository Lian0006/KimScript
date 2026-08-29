import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  Loader2, 
  Hash, 
  TrendingUp, 
  Copy, 
  RefreshCw, 
  Sparkles, 
  Target,
  Calendar,
  Globe,
  Filter,
  Download,
  Share2,
  ArrowLeft,
  Home
} from "lucide-react";
import jsPDF from 'jspdf';

interface HashtagData {
  hashtag: string;
  category: string;
  trending: boolean;
  engagement: number;
  difficulty: 'Low' | 'Medium' | 'High';
  platform: string[];
  relevance: number;
}

interface TrendingTopic {
  topic: string;
  hashtags: string[];
  volume: number;
  growth: string;
  category: string;
}

const platforms = [
  { id: "tiktok", name: "TikTok", color: "bg-pink-500" },
  { id: "instagram", name: "Instagram", color: "bg-purple-500" },
  { id: "youtube", name: "YouTube", color: "bg-red-500" },
  { id: "twitter", name: "Twitter/X", color: "bg-blue-500" },
  { id: "linkedin", name: "LinkedIn", color: "bg-blue-700" },
  { id: "facebook", name: "Facebook", color: "bg-blue-600" }
];

const categories = [
  "Lifestyle", "Business", "Tech", "Health", "Fashion", "Food", 
  "Travel", "Education", "Entertainment", "Sports", "Beauty", "Fitness"
];

const difficultyColors = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800", 
  High: "bg-red-100 text-red-800"
};

export default function ViralHashtagGenerator() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("");
  const [generatedHashtags, setGeneratedHashtags] = useState<HashtagData[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [copiedHashtag, setCopiedHashtag] = useState<string>("");
  const { toast } = useToast();

  const generateHashtags = useMutation({
    mutationFn: async (params: { keyword: string; platform: string; category: string }) => {
      const response = await apiRequest("POST", "/api/generate-hashtags", params);
      return response.json();
    },
    onSuccess: (result) => {
      setGeneratedHashtags(result.hashtags);
      setTrendingTopics(result.trendingTopics || []);
      toast({
        title: "Hashtags generados exitosamente",
        description: `Se generaron ${result.hashtags.length} hashtags relevantes`,
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sesión expirada",
          description: "Redirigiendo al login...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Error al generar hashtags",
        description: "No se pudieron generar los hashtags. Intenta de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!keyword.trim()) {
      toast({
        title: "Palabra clave requerida",
        description: "Ingresa una palabra clave o tema para generar hashtags",
        variant: "destructive",
      });
      return;
    }

    generateHashtags.mutate({
      keyword: keyword.trim(),
      platform: selectedPlatform,
      category: selectedCategory
    });
  };

  const copyHashtag = async (hashtag: string) => {
    try {
      await navigator.clipboard.writeText(hashtag);
      setCopiedHashtag(hashtag);
      toast({
        title: "Hashtag copiado",
        description: `${hashtag} copiado al portapapeles`,
      });
      setTimeout(() => setCopiedHashtag(""), 2000);
    } catch (error) {
      toast({
        title: "Error al copiar",
        description: "No se pudo copiar el hashtag",
        variant: "destructive",
      });
    }
  };

  const copyAllHashtags = async () => {
    const hashtagText = generatedHashtags.map(h => h.hashtag).join(' ');
    try {
      await navigator.clipboard.writeText(hashtagText);
      toast({
        title: "Todos los hashtags copiados",
        description: "Hashtags copiados al portapapeles",
      });
    } catch (error) {
      toast({
        title: "Error al copiar",
        description: "No se pudieron copiar los hashtags",
        variant: "destructive",
      });
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let yPosition = 30;

      // Header
      doc.setFillColor(139, 92, 246);
      doc.rect(0, 0, pageWidth, 25, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Hashtags Virales - KimScript', pageWidth / 2, 15, { align: 'center' });

      // Reset text color
      doc.setTextColor(0, 0, 0);
      yPosition = 40;

      // Keyword info
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Palabra clave: ${keyword}`, margin, yPosition);
      yPosition += 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Plataforma: ${selectedPlatform === 'all' ? 'Todas' : selectedPlatform}`, margin, yPosition);
      yPosition += 8;
      doc.text(`Categoría: ${selectedCategory === 'all' ? 'Todas' : selectedCategory}`, margin, yPosition);
      yPosition += 20;

      // Hashtags
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(139, 92, 246);
      doc.text('Hashtags Generados:', margin, yPosition);
      yPosition += 15;

      generatedHashtags.forEach((hashtagData, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`${index + 1}. ${hashtagData.hashtag}`, margin, yPosition);
        yPosition += 6;
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`   Categoría: ${hashtagData.category} | Dificultad: ${hashtagData.difficulty} | Relevancia: ${hashtagData.relevance}%`, margin, yPosition);
        yPosition += 8;
      });

      // Trending topics
      if (trendingTopics.length > 0) {
        yPosition += 10;
        if (yPosition > 230) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(139, 92, 246);
        doc.text('Temas Trending:', margin, yPosition);
        yPosition += 15;

        trendingTopics.forEach((topic, index) => {
          if (yPosition > 240) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'bold');
          doc.text(`${index + 1}. ${topic.topic}`, margin, yPosition);
          yPosition += 6;
          
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          const topicHashtags = topic.hashtags.join(', ');
          const hashtagLines = doc.splitTextToSize(`   Hashtags: ${topicHashtags}`, pageWidth - margin * 2);
          doc.text(hashtagLines, margin, yPosition);
          yPosition += hashtagLines.length * 4 + 5;
        });
      }

      // Footer
      const footerY = doc.internal.pageSize.getHeight() - 20;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por KimScript - Transform Viral Videos into Marketing Gold', pageWidth / 2, footerY, { align: 'center' });

      // Save PDF
      const fileName = `hashtags-virales-${keyword.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF exportado",
        description: `Hashtags guardados como ${fileName}`,
      });
    } catch (error) {
      toast({
        title: "Error al exportar PDF",
        description: "No se pudo generar el archivo PDF",
        variant: "destructive",
      });
    }
  };

  const filteredHashtags = generatedHashtags.filter(hashtag => {
    const platformMatch = selectedPlatform === 'all' || hashtag.platform.includes(selectedPlatform);
    const categoryMatch = selectedCategory === 'all' || hashtag.category === selectedCategory;
    return platformMatch && categoryMatch;
  });

  return (
    <div className="w-full bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen p-6">
      <Card className="max-w-7xl mx-auto shadow-2xl border-0">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = '/'}
                variant="ghost"
                className="h-12 w-12 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center p-0"
              >
                <ArrowLeft className="h-6 w-6 text-white" />
              </Button>
              <div className="h-12 w-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Hash className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white">Generador de Hashtags Virales</CardTitle>
                <p className="text-purple-100 text-sm mt-1">Encuentra hashtags trending para maximizar tu alcance</p>
              </div>
            </div>
            {generatedHashtags.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={copyAllHashtags}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Todos
                </Button>
                <Button
                  onClick={exportToPDF}
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Search Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Palabra clave o tema
              </label>
              <Input
                placeholder="Ej: rutina matutina, productividad, fitness..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-12 border-purple-200 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plataforma
              </label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="h-12 border-purple-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las plataformas</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-12 border-purple-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <div className="text-center mb-8">
            <Button
              onClick={handleGenerate}
              disabled={generateHashtags.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg rounded-xl"
            >
              {generateHashtags.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generando hashtags...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Hashtags Virales
                </>
              )}
            </Button>
          </div>

          {/* Results */}
          {generatedHashtags.length > 0 && (
            <Tabs defaultValue="hashtags" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-50">
                <TabsTrigger value="hashtags" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Hashtags Generados ({filteredHashtags.length})
                </TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  Temas Trending ({trendingTopics.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hashtags" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredHashtags.map((hashtagData, index) => (
                    <Card key={index} className="border border-purple-200 hover:shadow-lg transition-all cursor-pointer group"
                          onClick={() => copyHashtag(hashtagData.hashtag)}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <span className="font-bold text-lg text-purple-600 group-hover:text-purple-800">
                            {hashtagData.hashtag}
                          </span>
                          <div className="flex items-center gap-1">
                            {hashtagData.trending && (
                              <TrendingUp className="h-4 w-4 text-orange-500" />
                            )}
                            <Copy className={`h-4 w-4 transition-colors ${
                              copiedHashtag === hashtagData.hashtag ? 'text-green-500' : 'text-gray-400 group-hover:text-purple-600'
                            }`} />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Categoría:</span>
                            <Badge variant="outline" className="text-xs">
                              {hashtagData.category}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Dificultad:</span>
                            <Badge className={`text-xs ${difficultyColors[hashtagData.difficulty]}`}>
                              {hashtagData.difficulty}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Relevancia:</span>
                            <span className="font-medium text-purple-600">{hashtagData.relevance}%</span>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-2">
                            {hashtagData.platform.slice(0, 3).map((platform, idx) => {
                              const platformInfo = platforms.find(p => p.id === platform);
                              return (
                                <Badge key={idx} className={`text-xs text-white ${platformInfo?.color || 'bg-gray-500'}`}>
                                  {platformInfo?.name || platform}
                                </Badge>
                              );
                            })}
                            {hashtagData.platform.length > 3 && (
                              <Badge className="text-xs bg-gray-500 text-white">
                                +{hashtagData.platform.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {trendingTopics.map((topic, index) => (
                    <Card key={index} className="border border-blue-200 hover:shadow-lg transition-all">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg text-blue-600 mb-2">{topic.topic}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Volumen: {topic.volume.toLocaleString()}</span>
                              <span className="text-green-600 font-medium">{topic.growth}</span>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            {topic.category}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Hashtags relacionados:</p>
                          <div className="flex flex-wrap gap-2">
                            {topic.hashtags.map((hashtag, idx) => (
                              <Badge 
                                key={idx} 
                                variant="outline" 
                                className="cursor-pointer hover:bg-blue-50 text-xs"
                                onClick={() => copyHashtag(hashtag)}
                              >
                                {hashtag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}

          {/* Empty State */}
          {generatedHashtags.length === 0 && !generateHashtags.isPending && (
            <div className="text-center py-12">
              <Hash className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                ¿Listo para encontrar hashtags virales?
              </h3>
              <p className="text-gray-500">
                Ingresa una palabra clave y genera hashtags optimizados para maximizar tu alcance
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}