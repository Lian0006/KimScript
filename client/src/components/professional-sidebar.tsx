import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Search, 
  File, BarChart3, 
  Hash, 
  Settings, 
  LogOut, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  User,
  Bell,
  HelpCircle,
  Zap,
  Target,
  TrendingUp,
  Video,
  Brain,
  Layers,
  Menu,
  X
} from "lucide-react";

export default function ProfessionalSidebar() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => location === path;

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
      badge: null
    },
    {
      id: 'analyze',
      label: 'Analizar Video',
      icon: Search,
      action: () => handleScrollTo("analysis-form"),
      badge: 'Nuevo'
    },
    {
      id: 'history',
      label: 'Historial',
      icon: File, action: () => handleScrollTo("script-history"),
      badge: null
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
      badge: null
    },
    {
      id: 'hashtags',
      label: 'Hashtags',
      icon: Hash,
      href: '/hashtags',
      badge: 'Pro'
    },
    {
      id: 'platforms',
      label: 'Plataformas',
      icon: Layers,
      href: '/platforms',
      badge: null
    }
  ];

  const quickStats = [
    { label: 'Scripts', value: '12', icon: File, color: 'text-blue-500' },
    { label: 'Score', value: '94%', icon: Target, color: 'text-green-500' },
    { label: 'Videos', value: '8', icon: Video, color: 'text-purple-500' }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">KimScript</h2>
                <p className="text-xs text-gray-500">AI Content Studio</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="h-10 w-10 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex h-8 w-8 p-0 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-b border-gray-200/50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="h-10 w-10 bg-gradient-to-r from-violet-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-sm font-semibold text-white">
              {(user as any)?.firstName?.charAt(0) || (user as any)?.email?.charAt(0) || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'Usuario'}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                  Premium
                </Badge>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Resumen</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`h-8 w-8 mx-auto mb-2 rounded-lg bg-gray-100 flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-xs font-semibold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = item.href ? isActive(item.href) : false;
          
          return (
            <div key={item.id}>
              {item.href ? (
                <Link href={item.href}>
                  <a className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isItemActive
                      ? 'bg-violet-50 text-violet-700 border-r-2 border-violet-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}>
                    <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} ${isItemActive ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant={item.badge === 'Pro' ? 'default' : 'secondary'}
                            className={`text-xs ${
                              item.badge === 'Pro' 
                                ? 'bg-violet-100 text-violet-700 border-violet-200' 
                                : 'bg-green-100 text-green-700 border-green-200'
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                        {isItemActive && <ChevronRight className="h-4 w-4 ml-2 text-violet-600" />}
                      </>
                    )}
                  </a>
                </Link>
              ) : (
                <button
                  onClick={item.action}
                  className={`group w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-left ${
                    'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'} text-gray-400 group-hover:text-gray-500`} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant={item.badge === 'Pro' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            item.badge === 'Pro' 
                              ? 'bg-violet-100 text-violet-700 border-violet-200' 
                              : 'bg-green-100 text-green-700 border-green-200'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      {/* Quick Actions */}
      {!isCollapsed && (
        <div className="px-6 py-4 border-t border-gray-200/50">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Acciones Rápidas</h3>
          <div className="space-y-2">
            <Button 
              size="sm" 
              className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white"
              onClick={() => handleScrollTo("analysis-form")}
            >
              <Zap className="h-4 w-4 mr-2" />
              Nuevo Análisis
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full border-gray-200 hover:bg-gray-50"
              onClick={() => handleScrollTo("script-history")}
            >
              <File className="h-4 w-4 mr-2" />
              Ver Historial
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200/50">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => { await signOut(); window.location.href = "/login"; }}
            className={`text-gray-600 hover:text-gray-900 hover:bg-gray-100 ${isCollapsed ? 'px-2' : 'flex-1 justify-start'}`}
          >
            <LogOut className="h-4 w-4" />
            {!isCollapsed && <span className="ml-2">Cerrar Sesión</span>}
          </Button>
        </div>
        {!isCollapsed && (
          <p className="text-xs text-gray-400 mt-2 text-center">© 2024 KimScript</p>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white shadow-lg border"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        ${isCollapsed ? 'w-16' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-all duration-300 ease-in-out
        bg-white border-r border-gray-200 shadow-lg lg:shadow-none
        flex flex-col h-full
      `}>
        <SidebarContent />
      </aside>
    </>
  );
}
