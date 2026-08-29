import { useAuth } from "@/hooks/useAuth";
import ViralHashtagGenerator from "@/components/viral-hashtag-generator";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hash } from "lucide-react";
import { Link } from "wouter";

export default function HashtagGeneratorPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando generador...</p>
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
              <Hash className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Generador de Hashtags</h1>
              <p className="text-gray-600 text-lg">Crea hashtags virales para tus contenidos</p>
            </div>
          </div>
        </div>

        <ViralHashtagGenerator />
      </div>
    </DashboardLayout>
  );
}