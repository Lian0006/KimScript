/**
 * Mercado Pago Subscriptions – crear plan y obtener init_point para checkout.
 * Usa la API REST (no SDK) para no depender de npm install.
 */

import { getPlanById, type PlanId } from "@shared/plans";

const MP_API = "https://api.mercadopago.com";

function getAccessToken(): string {
  const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!token) throw new Error("MERCADOPAGO_ACCESS_TOKEN no configurado");
  return token;
}

/** Crea un preapproval_plan en MP y devuelve init_point (URL de pago) y plan id */
export async function createSubscriptionCheckout(params: {
  planId: PlanId;
  subscriptionId: number;
  backUrl: string;
  payerEmail?: string;
}): Promise<{ initPoint: string; preapprovalPlanId: string }> {
  const plan = getPlanById(params.planId);
  if (!plan || plan.id === "free") throw new Error("Plan no válido para suscripción");
  const token = getAccessToken();

  // Mercado Pago: en cuentas MX/AR etc. el monto va en moneda local; suele haber mínimo (ej. 1600 MXN).
  // Si envías menos, devuelve 400 y no se abre el checkout. Ajustamos para cumplir mínimo y que abra la pantalla de pago.
  const currency = (process.env.MERCADOPAGO_CURRENCY || "USD").toUpperCase();
  let transactionAmount: number;
  if (currency === "USD") {
    transactionAmount = plan.priceUsd;
  } else {
    const rate = Number(process.env.MERCADOPAGO_USD_TO_LOCAL) || 17;
    const minLocal = Number(process.env.MERCADOPAGO_MIN_AMOUNT) || 1600;
    transactionAmount = Math.max(Math.round(plan.priceUsd * rate), minLocal);
  }

  const body = {
    reason: `KimScript – Plan ${plan.name}`,
    auto_recurring: {
      frequency: 1,
      frequency_type: "months" as const,
      transaction_amount: transactionAmount,
      currency_id: currency,
    },
    back_url: params.backUrl,
    external_reference: String(params.subscriptionId),
  };

  const res = await fetch(`${MP_API}/preapproval_plan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mercado Pago: ${res.status} – ${text}`);
  }

  const data = (await res.json()) as { id: string; init_point?: string };
  const initPoint = data.init_point ?? `https://www.mercadopago.com/subscriptions/checkout?preapproval_plan_id=${data.id}`;
  return { initPoint, preapprovalPlanId: data.id };
}

/** Obtiene un preapproval (suscripción) de MP por id */
export async function getPreapproval(preapprovalId: string): Promise<{
  id: string;
  status?: string;
  external_reference?: string;
  payer_email?: string;
  preapproval_plan_id?: string;
}> {
  const token = getAccessToken();
  const res = await fetch(`${MP_API}/preapproval/${preapprovalId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Mercado Pago getPreapproval: ${res.status} – ${text}`);
  }
  return res.json();
}
