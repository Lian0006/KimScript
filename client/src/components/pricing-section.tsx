import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap, Sparkles } from "lucide-react";
import { PLANS, PLAN_FEATURES, type PlanId } from "@shared/plans";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

function FeatureCell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
          <Check className="w-4 h-4" />
        </span>
      </td>
    );
  }
  if (value === false) {
    return (
      <td className="px-4 py-3 text-center">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400">
          <X className="w-4 h-4" />
        </span>
      </td>
    );
  }
  return (
    <td className="px-4 py-3 text-center text-sm text-gray-600">
      {value}
    </td>
  );
}

function PlanCard({ plan, onSelect }: { plan: (typeof PLANS)[number]; onSelect: (planId: PlanId) => void }) {
  const isFree = plan.id === "free";
  const colorClasses: Record<string, string> = {
    emerald: "border-emerald-500/30 bg-emerald-50/50",
    blue: "border-blue-500/30 bg-blue-50/50",
    violet: "border-violet-500/30 bg-violet-50/50",
  };
  const borderClass = plan.highlighted ? "ring-2 ring-violet-500 shadow-lg" : "";
  const cardBg = plan.highlighted ? "bg-gradient-to-b from-white to-violet-50/30" : "bg-white";

  return (
    <Card className={`${cardBg} ${borderClass} border ${colorClasses[plan.color] || ""} transition-all hover:shadow-md`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{plan.name}</CardTitle>
          {plan.highlighted && (
            <Badge className="bg-violet-600 text-white">Más popular</Badge>
          )}
        </div>
        <CardDescription className="text-xs text-gray-500">{plan.idealFor}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-gray-900">
            {plan.priceUsd === 0 ? "Gratis" : `$${plan.priceUsd}`}
          </span>
          {plan.priceUsd > 0 && (
            <span className="text-sm text-gray-500">/ mes</span>
          )}
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span>{plan.credits} créditos</span>
          </li>
          <li className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <span>{plan.aiMinutes} min IA</span>
          </li>
        </ul>
        <Button
          variant={plan.highlighted ? "default" : "outline"}
          className={`w-full ${plan.highlighted ? "bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700" : ""}`}
          onClick={() => onSelect(plan.id)}
        >
          {isFree ? "Empezar gratis" : "Elegir plan"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PricingSection() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  const handleSelectPlan = (planId: PlanId) => {
    if (planId === "free") {
      setLocation(isAuthenticated ? "/" : "/login");
      return;
    }
    // Mercado Pago: redirigir a checkout (se implementará después)
    if (isAuthenticated) {
      setLocation(`/checkout?plan=${planId}`);
    } else {
      setLocation(`/login?redirect=${encodeURIComponent(`/checkout?plan=${planId}`)}`);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Planes que se adaptan a ti
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Empieza gratis y escala cuando lo necesites. Todos los planes incluyen transcripción y guion IA.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} />
          ))}
        </div>

        {/* Features comparison table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/80">
                <th className="text-left px-4 py-3 font-semibold text-gray-900">Beneficio / Función</th>
                <th className="px-4 py-3 font-semibold text-gray-900 text-center">Free</th>
                <th className="px-4 py-3 font-semibold text-gray-900 text-center">Lite</th>
                <th className="px-4 py-3 font-semibold text-gray-900 text-center">Creator</th>
                <th className="px-4 py-3 font-semibold text-gray-900 text-center">Profesional</th>
              </tr>
            </thead>
            <tbody>
              {PLAN_FEATURES.map((feature) => (
                <tr key={feature.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-700">{feature.label}</td>
                  <FeatureCell value={feature.free} />
                  <FeatureCell value={feature.lite} />
                  <FeatureCell value={feature.creator} />
                  <FeatureCell value={feature.profesional} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Los pagos se procesan de forma segura. Próximamente integración con Mercado Pago.
        </p>
      </div>
    </section>
  );
}
