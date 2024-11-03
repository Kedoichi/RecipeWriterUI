import { RecipeCard } from './recipe-card';

const DUMMY_RECIPES = [
  {
    id: '1',
    title: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta dish',
    ingredients: ['Pasta', 'Eggs', 'Pecorino', 'Guanciale'],
    instructions: ['Cook pasta', 'Mix eggs and cheese', 'Combine all'],
    cookingTime: '20 mins',
    servings: 2,
  },
  // Add more dummy recipes as needed
];

export function RecipeList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {DUMMY_RECIPES.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
