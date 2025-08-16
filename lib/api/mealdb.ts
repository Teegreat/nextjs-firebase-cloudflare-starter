// lib/api/mealdb.ts
export type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

const MEALDB_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

function shuffle<T>(items: T[]): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const fetchMeals = async (search: string = ""): Promise<Meal[]> => {
  const res = await fetch(`${MEALDB_BASE_URL}/search.php?s=${search}`);
  if (!res.ok) throw new Error("Failed to fetch meals");
  const data = await res.json();
  const meals: Meal[] = Array.isArray(data.meals) ? data.meals : [];
  const withImages: Meal[] = meals.filter(
    (m: Meal) =>
      typeof m?.strMealThumb === "string" && m.strMealThumb.trim().length > 0
  );
  const randomized = shuffle(withImages);
  return randomized.slice(0, 15);
};
