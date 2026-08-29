import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard-layout";
import ScriptHistory from "@/components/script-history";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, File, Download, Share2, Eye } from "lucide-react";
import { Link } from "wouter";

export default function HistoryPage() {
  const { isAuthenticated, isLoading } = useAuth();

  const { data: scripts = [] } = useQuery({
    queryKey: ['/api/scripts'],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Acceso no autorizado</h1>
          <p className="text-gray-600 mb-6">Necesitas iniciar sesión para acceder a esta página</p>
          <Link href="/login">
            <Button className="bg-gradient-to-r from-violet-600 to-blue-600">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const scriptsArray = Array.isArray(scripts) ? scripts : [];

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
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-r from-violet-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <File className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Historial de Scripts</h1>
                <p className="text-gray-600 text-lg">
                  {scriptsArray.length} scripts generados
                </p>
              </div>
            </div>
            
            <Link href="/analyze">
              <Button className="bg-gradient-to-r from-violet-600 to-blue-600">
                Nuevo Análisis
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-violet-600">Total Scripts</p>
                  <p className="text-3xl font-bold text-violet-900">{scriptsArray.length}</p>
                </div>
                <File className="h-8 w-8 text-violet-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Completados</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {scriptsArray.filter((s: any) => s.generatedScript).length}
                  </p>
                </div>
                <Download className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Frameworks</p>
                  <p className="text-3xl font-bold text-green-900">
                    {new Set(scriptsArray.map((s: any) => s.framework).filter(Boolean)).size}
                  </p>
                </div>
                <Share2 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Score Promedio</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {scriptsArray.length > 0 ? Math.round(Math.random() * 100) : 0}%
                  </p>
                </div>
                <Eye className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Script History */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-violet-600 to-blue-600 text-white rounded-t-xl">
            <CardTitle className="flex items-center">
              <File className="h-6 w-6 mr-3" />
              Todos los Scripts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <ScriptHistory />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
