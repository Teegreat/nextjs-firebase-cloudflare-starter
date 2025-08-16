
"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchMeals, type Meal } from "@/lib/api/mealdb";
import { MealCard } from "@/components/MealCard";
import { Input } from "@/components/ui/input"; // Shadcn
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";

export default function MealsPage() {
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals", debouncedSearch],
    queryFn: () => fetchMeals(debouncedSearch),
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <Input
          placeholder="Search meals..."
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xl"
        />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal: Meal) => (
            <MealCard key={meal.idMeal} meal={meal} />
          ))}
        </div>
      )}
    </div>
  );
}
