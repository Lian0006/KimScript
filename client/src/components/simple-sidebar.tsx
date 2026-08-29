import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  File, BarChart3, 
  Hash, 
  Settings, 
  LogOut, 
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function SimpleSidebar() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();

  const handleNavigateTo = (path: string) => {
    window.location.href = path;
  };

  const isActive = (path: string) => location === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm min-h-screen">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">KimScript</h2>
            <p className="text-xs text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-white">
              {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500">Usuario Premium</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        <Link href="/">
          <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive('/') 
              ? 'bg-violet-50 text-violet-700 border-r-2 border-violet-600' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}>
            <LayoutDashboard className="h-5 w-5 mr-3" />
            <span>Dashboard</span>
            {isActive('/') && <ChevronRight className="h-4 w-4 ml-auto" />}
          </a>
        </Link>

        <button
          onClick={() => handleNavigateTo("/analyze")}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          <Search className="h-5 w-5 mr-3" />
          <span>Analizar Video</span>
        </button>

        <button
          onClick={() => handleNavigateTo("/history")}
          className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left text-gray-700 hover:bg-gray-50 hover:text-gray-900"
        >
          <File className="h-5 w-5 mr-3" />
          <span>Historial</span>
        </button>

        <Link href="/analytics">
          <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive('/analytics') 
              ? 'bg-violet-50 text-violet-700 border-r-2 border-violet-600' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}>
            <BarChart3 className="h-5 w-5 mr-3" />
            <span>Analytics</span>
            {isActive('/analytics') && <ChevronRight className="h-4 w-4 ml-auto" />}
          </a>
        </Link>

        <Link href="/hashtags">
          <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive('/hashtags') 
              ? 'bg-violet-50 text-violet-700 border-r-2 border-violet-600' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}>
            <Hash className="h-5 w-5 mr-3" />
            <span>Hashtags</span>
            {isActive('/hashtags') && <ChevronRight className="h-4 w-4 ml-auto" />}
          </a>
        </Link>

        <Link href="/platforms">
          <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            isActive('/platforms') 
              ? 'bg-violet-50 text-violet-700 border-r-2 border-violet-600' 
              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }`}>
            <Settings className="h-5 w-5 mr-3" />
            <span>Plataformas</span>
            {isActive('/platforms') && <ChevronRight className="h-4 w-4 ml-auto" />}
          </a>
        </Link>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => { await signOut(); window.location.href = "/login"; }}
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  );
}
