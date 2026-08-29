import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Search, File, BarChart3, Hash, Layers, LogOut, Sparkles, ChevronRight } from "lucide-react";

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const isActive = (path: string) => location === path;

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-gradient-to-b from-purple-700 via-blue-700 to-purple-800 text-white sticky top-0">
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold">KimScript</div>
            <div className="text-xs text-white/70 truncate max-w-[9rem]">
              {user?.email || "Usuario"}
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <Link href="/">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive('/') 
              ? 'bg-white/20 text-white shadow-lg' 
              : 'hover:bg-white/10 text-white/90 hover:text-white'
          }`}>
            <LayoutDashboard className="h-4 w-4" />
            <span className="text-sm font-medium">Dashboard</span>
            {isActive('/') && <ChevronRight className="h-4 w-4 ml-auto" />}
          </a>
        </Link>

        <button
          onClick={() => handleScrollTo("analysis-form")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-left text-white/90 hover:text-white"
        >
          <Search className="h-4 w-4" />
          <span className="text-sm font-medium">Analizar Video</span>
        </button>

        <button
          onClick={() => handleScrollTo("script-history")}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-left text-white/90 hover:text-white"
        >
          <File className="h-4 w-4" />
          <span className="text-sm font-medium">Historial</span>
        </button>

        <Link href="/analytics">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive('/analytics') 
              ? 'bg-white/20 text-white shadow-lg' 
              : 'hover:bg-white/10 text-white/90 hover:text-white'
          }`}>
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">Analytics</span>
            {isActive('/analytics') && <ChevronRight className="h-4 w-4 ml-auto" />}
          </a>
        </Link>

        <Link href="/hashtags">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive('/hashtags') 
              ? 'bg-white/20 text-white shadow-lg' 
              : 'hover:bg-white/10 text-white/90 hover:text-white'
          }`}>
            <Hash className="h-4 w-4" />
            <span className="text-sm font-medium">Hashtags</span>
            {isActive('/hashtags') && <ChevronRight className="h-4 w-4 ml-auto" />}
          </a>
        </Link>

        <Link href="/platforms">
          <a className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            isActive('/platforms') 
              ? 'bg-white/20 text-white shadow-lg' 
              : 'hover:bg-white/10 text-white/90 hover:text-white'
          }`}>
            <Layers className="h-4 w-4" />
            <span className="text-sm font-medium">Plataformas</span>
            {isActive('/platforms') && <ChevronRight className="h-4 w-4 ml-auto" />}
          </a>
        </Link>
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <Button
          variant="outline"
          onClick={async () => { await signOut(); window.location.href = "/login"; }}
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t.logout || "Cerrar sesión"}
        </Button>
        <div className="text-[10px] text-white/50 mt-3">© {new Date().getFullYear()} KimScript</div>
      </div>
    </aside>
  );
}


