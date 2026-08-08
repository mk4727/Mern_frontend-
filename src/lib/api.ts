// Thin client for the Cactus World backend (Express + MongoDB).
// Config lives in src/lib/config.ts (no .env files). If API_URL is empty,
// callers fall back to local data — the store layer handles that gracefully.

import { API_URL } from "./config";

const BASE = API_URL.replace(/\/$/, "");

export const isApiConfigured = () => Boolean(BASE);


const ADMIN_TOKEN_KEY = "cw_admin_token";
export const getAdminToken = () => {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY) || "";
  } catch {
    return "";
  }
};
export const setAdminToken = (t: string) => {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, t);
  } catch {}
};
export const clearAdminToken = () => {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {}
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!BASE) throw new Error("API_URL is not set in src/lib/config.ts");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  const token = getAdminToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(msg || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>("/api/health"),

  adminLogin: (password: string) =>
    request<{ token: string }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  // Products
  listProducts: () => request<any[]>("/api/products"),
  createProduct: (data: any) =>
    request<any>("/api/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id: string, data: any) =>
    request<any>(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteProduct: (id: string) =>
    request<{ ok: boolean }>(`/api/products/${id}`, { method: "DELETE" }),

  // FAQs
  listFaqs: () => request<any[]>("/api/faqs"),
  createFaq: (data: any) =>
    request<any>("/api/faqs", { method: "POST", body: JSON.stringify(data) }),
  updateFaq: (id: string, data: any) =>
    request<any>(`/api/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteFaq: (id: string) =>
    request<{ ok: boolean }>(`/api/faqs/${id}`, { method: "DELETE" }),

  // Care tips
  listCareTips: () => request<any[]>("/api/care-tips"),
  createCareTip: (data: any) =>
    request<any>("/api/care-tips", { method: "POST", body: JSON.stringify(data) }),
  updateCareTip: (id: string, data: any) =>
    request<any>(`/api/care-tips/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCareTip: (id: string) =>
    request<{ ok: boolean }>(`/api/care-tips/${id}`, { method: "DELETE" }),

  // Orders
  createOrder: (data: any) =>
    request<any>("/api/orders", { method: "POST", body: JSON.stringify(data) }),
  listOrders: () => request<any[]>("/api/orders"),
};
