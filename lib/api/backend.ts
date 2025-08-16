import { getIdToken } from "@/lib/actions/auth.action";

// Must be public because this runs in the browser
const BACKEND_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(
  /\/+$/,
  ""
);

// helper
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  if (!BACKEND_BASE_URL) throw new Error("NEXT_PUBLIC_BACKEND_URL is not set");
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

export const getFavorites = async (uid: string): Promise<string[]> => {
  const response = await apiFetch(`/favorites/${uid}`, { method: "GET" });
  const favorites = Array.isArray(response?.data) ? response.data : [];
  return favorites.map((f: { mealId: string }) => f.mealId);
};

export const addFavorite = (mealId: string, title: string, image: string) =>
  apiFetch("/favorites", {
    method: "POST",
    body: JSON.stringify({ mealId, title, image }),
  });

export const removeFavorite = (mealId: string) =>
  apiFetch(`/favorites/${mealId}`, { method: "DELETE" });
