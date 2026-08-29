import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useLanguage } from "@/contexts/LanguageContext";
import { getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  BarChart3, 
  Hash, 
  Settings, 
  LogOut, 
  Sparkles,
  ChevronRight,
  File,
  Crown
} from "lucide-react";
import { getPlanById, type PlanId } from "@shared/plans";
import PlanUsageCard from "@/components/plan-usage-card";

export default function SimpleSidebarFixed() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { subscriptionPlan } = useUserProfile();
  const { t } = useLanguage();
  const [location] = useLocation();
  const planId = (subscriptionPlan || "free") as PlanId;
  const plan = getPlanById(planId);

  const { data: scripts = [] } = useQuery({
    queryKey: ["/api/scripts"],
    enabled: isAuthenticated,
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const scriptsArray = Array.isArray(scripts) ? scripts : [];
  const estimatedMinutesUsed = scriptsArray.length;

  const handleNavigateTo = (path: string) => {
    window.location.href = path;
  };

  const isActive = (path: string) => location === path;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm min-h-screen flex flex-col">
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
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {plan?.id === "profesional" ? (
                <Crown className="h-3 w-3 text-amber-500 shrink-0" />
              ) : (
                <Sparkles className="h-3 w-3 text-violet-500 shrink-0" />
              )}
              Plan {plan?.name ?? "Free"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1 flex-1">
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

        <a
          href="/pricing"
          className="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-violet-600 hover:bg-violet-50 hover:text-violet-700"
        >
          <Sparkles className="h-5 w-5 mr-3" />
          <span>Planes</span>
        </a>
      </nav>

      {/* Plan usage card */}
      <div className="px-4 py-4 mt-auto">
        <PlanUsageCard scriptsCount={scriptsArray.length} estimatedMinutesUsed={estimatedMinutesUsed} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-white">
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
