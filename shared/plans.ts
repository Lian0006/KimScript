/**
 * KimScript subscription plans – shared between client and server.
 * Used for pricing UI and later Mercado Pago integration.
 */

export type PlanId = "free" | "lite" | "creator" | "profesional";

export interface PlanFeature {
  id: string;
  label: string;
  free: string | boolean;
  lite: string | boolean;
  creator: string | boolean;
  profesional: string | boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  credits: number;
  aiMinutes: number;
  costUsd: number;
  priceUsd: number;
  marginPercent?: number;
  pricePerMinute?: number;
  idealFor: string;
  color: string;
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    credits: 36,
    aiMinutes: 6,
    costUsd: 0.54,
    priceUsd: 0,
    idealFor: "Prueba inicial / captar usuarios",
    color: "emerald",
    highlighted: false,
  },
  {
    id: "lite",
    name: "Lite",
    credits: 300,
    aiMinutes: 50,
    costUsd: 4.5,
    priceUsd: 10,
    marginPercent: 45,
    pricePerMinute: 0.164,
    idealFor: "Principiantes o creadores ocasionales",
    color: "emerald",
    highlighted: false,
  },
  {
    id: "creator",
    name: "Creator",
    credits: 1000,
    aiMinutes: 166,
    costUsd: 14.94,
    priceUsd: 30,
    marginPercent: 45,
    pricePerMinute: 0.164,
    idealFor: "Creadores activos y freelancers",
    color: "blue",
    highlighted: true,
  },
  {
    id: "profesional",
    name: "Profesional",
    credits: 3000,
    aiMinutes: 500,
    costUsd: 45,
    priceUsd: 100,
    marginPercent: 45,
    pricePerMinute: 0.164,
    idealFor: "Productoras o agencias de contenido",
    color: "violet",
    highlighted: false,
  },
];

export const PLAN_FEATURES: PlanFeature[] = [
  {
    id: "transcription",
    label: "Transcripción IA (Whisper)",
    free: "5 min máx.",
    lite: true,
    creator: true,
    profesional: true,
  },
  {
    id: "script_gen",
    label: "Generación de guion IA",
    free: "básica",
    lite: true,
    creator: true,
    profesional: true,
  },
  {
    id: "rewrite",
    label: "Reescritura avanzada (GPT-4o)",
    free: false,
    lite: true,
    creator: true,
    profesional: true,
  },
  {
    id: "export",
    label: "Exportación (SRT, PDF, DOCX)",
    free: false,
    lite: true,
    creator: true,
    profesional: true,
  },
  {
    id: "extra_credits",
    label: "Créditos extra con descuento",
    free: false,
    lite: "5%",
    creator: "10%",
    profesional: "15%",
  },
  {
    id: "priority",
    label: "Procesamiento prioritario",
    free: false,
    lite: false,
    creator: true,
    profesional: true,
  },
  {
    id: "api",
    label: "API / Integraciones",
    free: false,
    lite: false,
    creator: true,
    profesional: true,
  },
  {
    id: "support",
    label: "Soporte técnico",
    free: false,
    lite: "Básico",
    creator: "Avanzado",
    profesional: "Prioritario",
  },
];

export function getPlanById(id: PlanId): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getPlanByMercadoPagoId(preferenceIdOrPlanId: string): Plan | undefined {
  return PLANS.find((p) => p.id === preferenceIdOrPlanId);
}
