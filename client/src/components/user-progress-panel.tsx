import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock,
  ChevronRight,
  FileText,
  Video
} from "lucide-react";

interface RecentAnalysesPanelProps {
  recentAnalyses: Array<{
    id: number;
    title: string;
    score: number;
    date: string;
    framework: string;
    thumbnail?: string;
  }>;
}

export default function RecentAnalysesPanel({ recentAnalyses }: RecentAnalysesPanelProps) {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
        <CardTitle className="text-xl font-bold flex items-center">
          <Clock className="h-6 w-6 mr-3" />
          Análisis Recientes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {recentAnalyses.length > 0 ? (
            recentAnalyses.map((analysis, index) => (
              <div
                key={analysis.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                    {analysis.title}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {analysis.score}/10
                    </Badge>
                    <span className="text-xs text-gray-500">{analysis.framework}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{analysis.date}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No hay análisis recientes</p>
              <p className="text-gray-400 text-xs">Comienza analizando tu primer video</p>
            </div>
          )}
        </div>

        {recentAnalyses.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Ver Historial Completo
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
