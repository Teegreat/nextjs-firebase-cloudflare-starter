// hooks/useFavorites.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/api/backend";
import { useAppStore } from "@/store";

export const useFavorites = () => {
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
    enabled: !!user, // Only fetch if authenticated
  });

  const addMutation = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const removeMutation = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return {
    favorites,
    isLoading,
    addFavorite: (mealId: string) => addMutation.mutate(mealId),
    removeFavorite: (mealId: string) => removeMutation.mutate(mealId),
    isFavorite: (mealId: string) => favorites.includes(mealId), // Assuming favorites is array of mealIds
  };
};
