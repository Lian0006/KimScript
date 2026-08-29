import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getPlanById, type PlanId } from "@shared/plans";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Sparkles, Zap, ArrowUpRight, Crown } from "lucide-react";

interface DashboardPlanBannerProps {
  scriptsCount?: number;
  /** Estimated AI minutes used this period (e.g. from scripts) */
  estimatedMinutesUsed?: number;
}

const planColors: Record<string, string> = {
  free: "from-slate-100 to-slate-200 border-slate-300",
  lite: "from-emerald-50 to-emerald-100 border-emerald-200",
  creator: "from-violet-50 to-blue-100 border-violet-200",
  profesional: "from-amber-50 to-orange-100 border-amber-200",
};

const planBadgeColors: Record<string, string> = {
  free: "bg-slate-100 text-slate-700 border-slate-300",
  lite: "bg-emerald-100 text-emerald-800 border-emerald-300",
  creator: "bg-violet-100 text-violet-800 border-violet-300",
  profesional: "bg-amber-100 text-amber-800 border-amber-300",
};

export default function DashboardPlanBanner({
  scriptsCount = 0,
  estimatedMinutesUsed = 0,
}: DashboardPlanBannerProps) {
  const { subscriptionPlan, isLoading } = useUserProfile();
  // Mostrar siempre el banner: "Plan Free" mientras carga el perfil, luego el plan real
  const planId = (subscriptionPlan || "free") as PlanId;
  const plan = getPlanById(planId) ?? getPlanById("free")!;

  const creditsUsed = Math.min(scriptsCount, plan.credits);
  const creditsPercent = plan.credits > 0 ? Math.round((creditsUsed / plan.credits) * 100) : 0;
  const minutesUsed = Math.min(estimatedMinutesUsed, plan.aiMinutes);
  const minutesPercent = plan.aiMinutes > 0 ? Math.round((minutesUsed / plan.aiMinutes) * 100) : 0;
  const isFree = plan.id === "free";
  const gradient = planColors[plan.id] ?? planColors.free;
  const badgeClass = planBadgeColors[plan.id] ?? planBadgeColors.free;

  return (
    <Card className={`overflow-hidden border bg-gradient-to-r ${gradient} shadow-sm`}>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-white/80 shadow-sm flex items-center justify-center">
              {plan.id === "profesional" ? (
                <Crown className="h-6 w-6 text-amber-600" />
              ) : (
                <Sparkles className="h-6 w-6 text-violet-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">Plan {plan.name}</span>
                <Badge variant="outline" className={`text-xs font-medium ${badgeClass}`}>
                  {plan.credits} créditos · {plan.aiMinutes} min IA
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{plan.idealFor}</p>
            </div>
          </div>

          <div className="flex-1 max-w-md space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5" /> Créditos
                </span>
                <span>{creditsUsed} / {plan.credits}</span>
              </div>
              <Progress value={creditsPercent} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Minutos IA</span>
                <span>{minutesUsed} / {plan.aiMinutes} min</span>
              </div>
              <Progress value={minutesPercent} className="h-2" />
            </div>
          </div>

          {isFree && (
            <Button
              asChild
              className="shrink-0 bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 text-white shadow-md"
            >
              <a href="/pricing">
                Mejorar plan
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          )}
          {!isFree && plan.id !== "profesional" && (
            <Button asChild variant="outline" className="shrink-0">
              <a href="/pricing">
                Ver planes
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
