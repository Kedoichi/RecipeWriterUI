
import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import type { Recipe } from '@/lib/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/recipes/${recipe.id}`}>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            {recipe.cookingTime && (
              <div className="flex items-center gap-1">
                <Clock size={16} />
                {recipe.cookingTime}
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users size={16} />
                {recipe.servings} servings
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}