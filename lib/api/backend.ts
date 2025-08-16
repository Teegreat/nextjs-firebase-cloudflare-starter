// lib/api/backend.ts
import { getIdToken } from "@/lib/actions/auth.action";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://your-render-backend.onrender.com";

const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = await getIdToken();
  const res = await fetch(`${BACKEND_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Backend request failed");
  return res.json();
};

export const getFavorites = () => apiFetch("/favorites", { method: "GET" });

export const addFavorite = (mealId: string) =>
  apiFetch("/favorites", { method: "POST", body: JSON.stringify({ mealId }) });

export const removeFavorite = (mealId: string) =>
  apiFetch(`/favorites/${mealId}`, { method: "DELETE" });
