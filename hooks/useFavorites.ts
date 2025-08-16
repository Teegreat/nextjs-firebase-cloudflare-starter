import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite } from "@/lib/api/backend";
import { useAppStore } from "@/store";

export const useFavorites = () => {
  const { user } = useAppStore();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: () => getFavorites(user!.id),
    enabled: !!user,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: (meal: { mealId: string; title: string; image: string }) =>
      addFavorite(meal.mealId, meal.title, meal.image),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (mealId: string) => removeFavorite(mealId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favorites"] }),
  });

  return {
    favorites,
    isLoading,
    addFavorite: (meal: { mealId: string; title: string; image: string }) =>
      addFavoriteMutation.mutateAsync(meal),
    removeFavorite: (mealId: string) =>
      removeFavoriteMutation.mutateAsync(mealId),
    isMutating:
      addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
    isFavorite: (mealId: string) => favorites.includes(mealId),
  };
};
