// EmailJS integration — sends transactional emails directly from the browser.
// Sign up at https://www.emailjs.com, create a service + template, and set
// EMAILJS_SERVICE_ID / EMAILJS_TEMPLATE_ID / EMAILJS_PUBLIC_KEY in
// src/lib/config.ts (no .env files).
//
// We call the EmailJS REST API directly (no extra dependency required).

import {
  EMAILJS_SERVICE_ID as SERVICE_ID,
  EMAILJS_TEMPLATE_ID as TEMPLATE_ID,
  EMAILJS_PUBLIC_KEY as PUBLIC_KEY,
} from "./config";

export const isEmailJsConfigured = () =>
  Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);


export interface OrderEmailParams {
  to_name: string;
  to_email: string;
  order_id: string;
  order_total: string;
  order_items: string;
}

export async function sendOrderEmail(params: OrderEmailParams): Promise<void> {
  if (!isEmailJsConfigured()) {
    console.warn("[emailjs] Skipping email — EmailJS env vars are not set.");
    return;
  }
  const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: params,
    }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`EmailJS error: ${msg}`);
  }
}
