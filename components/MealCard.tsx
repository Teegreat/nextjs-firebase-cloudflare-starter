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

  const toggleFavorite = async () => {
    try {
      if (favorited) {
        await removeFavorite(meal.idMeal);
        toast.success("Removed from favorites");
      } else {
        await addFavorite({
          mealId: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
        });
        toast.success("Added to favorites");
      }
    } catch (err) {
      toast.error("Action failed. Please try again.");
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
