import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageToggle from "@/components/language-toggle";
import { useLocation } from "wouter";

export default function Header() {
  const { isAuthenticated, user, signOut } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await signOut();
    setLocation('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                KimScript
              </h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageToggle />
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => setLocation("/dashboard")}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setLocation("/pricing")}
                >
                  Planes
                </Button>
                {user?.profileImageUrl && (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <span className="text-gray-700 font-medium">
                  {user?.firstName || user?.email || 'User'}
                </span>
                <Button 
                  variant="ghost"
                  onClick={handleLogout}
                >
                  {t.logout}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => setLocation("/pricing")}
                >
                  Planes
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setLocation("/login")}
                >
                  {t.login}
                </Button>
                <Button 
                  className="bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:from-violet-700 hover:to-blue-700"
                  onClick={() => setLocation("/login")}
                >
                  {t.getStarted}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
