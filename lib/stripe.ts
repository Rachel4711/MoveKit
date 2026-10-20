import { env } from "cloudflare:workers";
import type { OrderLine } from "@/db/orders";

type StripeSession = {
  id: string;
  url: string | null;
};

type StripeCheckoutEvent = {
  id: string;
  type: string;
  data: {
    object: {
      metadata?: { order_id?: string };
      customer_details?: { email?: string | null };
    };
  };
};

function getSecret(name: "STRIPE_SECRET_KEY" | "STRIPE_WEBHOOK_SECRET") {
  const value = (env as unknown as Record<string, string | undefined>)[name];
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

export function isStripeConfigured() {
  return Boolean((env as unknown as Record<string, string | undefined>).STRIPE_SECRET_KEY);
}

export async function createStripeCheckoutSession(
  orderId: string,
  lines: OrderLine[],
  origin: string,
) {
  const form = new URLSearchParams({
    mode: "payment",
    client_reference_id: orderId,
    success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/?checkout=cancelled`,
    "metadata[order_id]": orderId,
  });

  lines.forEach((line, index) => {
    const prefix = `line_items[${index}]`;
    form.set(`${prefix}[price_data][currency]`, "usd");
    form.set(`${prefix}[price_data][unit_amount]`, String(line.unitPriceInCents));
    form.set(`${prefix}[price_data][product_data][name]`, line.productName);
    form.set(`${prefix}[price_data][product_data][description]`, line.variant);
    form.set(`${prefix}[quantity]`, String(line.quantity));
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecret("STRIPE_SECRET_KEY")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  const data = await response.json() as StripeSession & { error?: { message?: string } };

  if (!response.ok) throw new Error(data.error?.message ?? "Stripe rejected the checkout session.");
  if (!data.url) throw new Error("Stripe did not return a checkout URL.");
  return data;
}

function hexToBytes(hex: string) {
  if (!/^[0-9a-f]+$/i.test(hex) || hex.length % 2 !== 0) return null;
  return new Uint8Array(hex.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)));
}

function signaturesMatch(actual: ArrayBuffer, expectedHex: string) {
  const expected = hexToBytes(expectedHex);
  const actualBytes = new Uint8Array(actual);
  if (!expected || expected.length !== actualBytes.length) return false;
  let difference = 0;
  for (let index = 0; index < actualBytes.length; index += 1) {
    difference |= actualBytes[index] ^ expected[index];
  }
  return difference === 0;
}

export async function verifyStripeWebhook(payload: string, signatureHeader: string) {
  const values = signatureHeader.split(",");
  const timestamp = values.find((value) => value.startsWith("t="))?.slice(2);
  const signatures = values.filter((value) => value.startsWith("v1=")).map((value) => value.slice(3));
  if (!timestamp || signatures.length === 0) throw new Error("Invalid Stripe signature header.");
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) throw new Error("Expired Stripe webhook.");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret("STRIPE_WEBHOOK_SECRET")),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${payload}`),
  );
  if (!signatures.some((signature) => signaturesMatch(digest, signature))) {
    throw new Error("Invalid Stripe webhook signature.");
  }

  return JSON.parse(payload) as StripeCheckoutEvent;
}
