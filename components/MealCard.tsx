"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { toast } from "sonner";

interface MealCardProps {
  meal: { idMeal: string; strMeal: string; strMealThumb: string };
}

export const MealCard = ({ meal }: MealCardProps) => {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(meal.idMeal);

  const toggleFavorite = () => {
    if (favorited) {
      removeFavorite(meal.idMeal);
      toast.success("Removed from favorites");
    } else {
      addFavorite(meal.idMeal);
      toast.success("Added to favorites");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="font-medium text-base">{meal.strMeal}</CardHeader>
      <CardContent className="space-y-3">
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className="w-full h-40 object-cover rounded-md"
        />
        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={toggleFavorite}
        >
          <Heart className={favorited ? "fill-red-500" : ""} />
        </Button>
      </CardContent>
    </Card>
  );
};
