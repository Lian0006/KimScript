import { Switch, Route } from "wouter";
import { queryClient, getQueryFn } from "./lib/queryClient";
import { QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import ConfirmEmail from "@/pages/confirm-email";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import HashtagGeneratorPage from "@/pages/hashtag-generator";
import SharePage from "@/pages/share";
import Platforms from "@/pages/platforms";
import AnalyzePage from "@/pages/analyze";
import HistoryPage from "@/pages/history";
import PricingPage from "@/pages/pricing";
import CheckoutPage from "@/pages/checkout";
import NotFound from "@/pages/not-found";

const queryFnWithNullOn401 = getQueryFn({ on401: "returnNull" });

/** Prefetch perfil y scripts en cuanto hay sesión para que el dashboard cargue al instante */
function PrefetchDashboardData() {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();
  useEffect(() => {
    if (!isAuthenticated) return;
    qc.prefetchQuery({ queryKey: ["/api/auth/user"], queryFn: queryFnWithNullOn401 });
    qc.prefetchQuery({ queryKey: ["/api/scripts"], queryFn: queryFnWithNullOn401 });
  }, [isAuthenticated, qc]);
  return null;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <PrefetchDashboardData />}
      <Switch>
        <Route path="/share/:data" component={SharePage} />
        <Route path="/login" component={Login} />
        <Route path="/confirm-email" component={ConfirmEmail} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/checkout/success" component={CheckoutPage} />
        <Route path="/checkout" component={CheckoutPage} />
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Landing} />
            <Route path="/home" component={Home} />
          </>
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
          <Route path="/home" component={Home} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/hashtags" component={HashtagGeneratorPage} />
          <Route path="/platforms" component={Platforms} />
          <Route path="/analyze" component={AnalyzePage} />
          <Route path="/history" component={HistoryPage} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
