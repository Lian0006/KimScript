import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPlanById, type PlanId } from "@shared/plans";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/contexts/AuthContext";
import { Loader2, CreditCard, CheckCircle } from "lucide-react";

export default function Checkout() {
  const [location, setLocation] = useLocation();
  const isSuccess = location === "/checkout/success";
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [planId, setPlanId] = useState<PlanId | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan") as PlanId | null;
    const subId = params.get("subscription_id");
    if (plan && ["free", "lite", "creator", "profesional"].includes(plan)) {
      setPlanId(plan);
    }
    if (subId && !plan) setPlanId("lite"); // placeholder para vista success
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [isLoading, isAuthenticated, setLocation]);

  const plan = planId ? getPlanById(planId) : null;

  if (isSuccess || (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("subscription_id"))) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Suscripción procesada</CardTitle>
            <CardDescription>
              Mercado Pago ha recibido tu pago. Tu plan se activará en unos momentos. Si no ves el cambio, recarga el dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-gradient-to-r from-violet-600 to-blue-600" onClick={() => setLocation("/dashboard")}>
              Ir al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  if (!plan || plan.id === "free") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Plan no seleccionado</CardTitle>
            <CardDescription>Elige un plan en la página de precios.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => setLocation("/pricing")}>
              Ver planes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handlePayWithMercadoPago = async () => {
    setIsRedirecting(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://www.kimscript.com";
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${baseUrl}/api/subscription/create-checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}) },
        body: JSON.stringify({ planId: plan.id }),
        credentials: "include",
      });
      const data = (await res.json()) as { initPoint?: string; message?: string };
      if (res.ok && data.initPoint) {
        window.location.href = data.initPoint;
        return;
      }
      toast({
        title: "Error",
        description: data.message || `Error ${res.status}: no se pudo crear el checkout`,
        variant: "destructive",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error)?.message || "Error al conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setIsRedirecting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Checkout – {plan.name}</CardTitle>
          <CardDescription>
            ${plan.priceUsd} USD / mes · {plan.credits} créditos · {plan.aiMinutes} min IA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Pago seguro con Mercado Pago. Serás redirigido a su página para completar la suscripción mensual.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setLocation("/pricing")} disabled={isRedirecting}>
              Volver a planes
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-violet-600 to-blue-600"
              onClick={handlePayWithMercadoPago}
              disabled={isRedirecting}
            >
              {isRedirecting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Redirigiendo...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pagar con Mercado Pago
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
