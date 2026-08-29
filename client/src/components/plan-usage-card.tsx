import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPlanById, type PlanId } from "@shared/plans";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Sparkles, Crown } from "lucide-react";

interface PlanUsageCardProps {
  scriptsCount?: number;
  estimatedMinutesUsed?: number;
}

const planLabelClass: Record<string, string> = {
  free: "text-slate-600",
  lite: "text-emerald-700",
  creator: "text-violet-700",
  profesional: "text-amber-700",
};

export default function PlanUsageCard({
  scriptsCount = 0,
  estimatedMinutesUsed = 0,
}: PlanUsageCardProps) {
  const { subscriptionPlan, isLoading } = useUserProfile();
  const planId = (subscriptionPlan || "free") as PlanId;
  const plan = getPlanById(planId);

  if (isLoading || !plan) return null;

  const creditsUsed = Math.min(scriptsCount, plan.credits);
  const creditsPercent = plan.credits > 0 ? Math.round((creditsUsed / plan.credits) * 100) : 0;
  const minutesUsed = Math.min(estimatedMinutesUsed, plan.aiMinutes);
  const minutesPercent = plan.aiMinutes > 0 ? Math.round((minutesUsed / plan.aiMinutes) * 100) : 0;
  const labelClass = planLabelClass[plan.id] ?? planLabelClass.free;

  return (
    <Card className="border border-gray-200 bg-white shadow-sm overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {plan.id === "profesional" ? (
            <Crown className="h-4 w-4 text-amber-500 shrink-0" />
          ) : (
            <Sparkles className="h-4 w-4 text-violet-500 shrink-0" />
          )}
          <span className={`text-sm font-semibold ${labelClass}`}>Plan {plan.name}</span>
        </div>
        <div className="space-y-2 text-xs">
          <div>
            <div className="flex justify-between text-gray-500 mb-0.5">
              <span>Créditos</span>
              <span>{creditsUsed}/{plan.credits}</span>
            </div>
            <Progress value={creditsPercent} className="h-1.5" />
          </div>
          <div>
            <div className="flex justify-between text-gray-500 mb-0.5">
              <span>Min IA</span>
              <span>{minutesUsed}/{plan.aiMinutes}</span>
            </div>
            <Progress value={minutesPercent} className="h-1.5" />
          </div>
        </div>
        <a
          href="/pricing"
          className="mt-3 block text-center text-xs font-medium text-violet-600 hover:text-violet-700"
        >
          Ver planes
        </a>
      </CardContent>
    </Card>
  );
}
