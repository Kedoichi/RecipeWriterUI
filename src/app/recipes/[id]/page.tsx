import Link from 'next/link';
import { ArrowLeft, Edit} from 'lucide-react';
import { DUMMY_RECIPES } from '@/lib/data/recipe';

const getRecipe = (id: string) => {
  return DUMMY_RECIPES.find(recipe => recipe.id === id);
};

export default function RecipePage({ params }: { params: { id: string } }) {
  const recipe = getRecipe(params.id);

  if (!recipe) {
    return <div>Recipe not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to Recipes
          </Link>
          
          <Link
            href={`/recipes/edit/${recipe.id}`}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Edit size={20} />
            Edit Recipe
          </Link>
        </div>

        {/* Recipe Image */}
        <div className="w-full h-[400px] mb-8 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Recipe Content */}
        <div className="space-y-8">
          {/* Title and Description */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
            <p className="text-gray-600 text-lg">{recipe.description}</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Time</p>
              <p className="font-semibold">{recipe.preparationTime.total}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Prep Time</p>
              <p className="font-semibold">{recipe.preparationTime.preparation}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Cook Time</p>
              <p className="font-semibold">{recipe.preparationTime.cooking}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Calories</p>
              <p className="font-semibold">{recipe.nutrition.calories}</p>
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
                >
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
            <ol className="space-y-6">
              {recipe.instructions.map((instruction) => (
                <li 
                  key={instruction.step}
                  className="flex gap-4"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shrink-0">
                    {instruction.step}
                  </span>
                  <p className="pt-1">{instruction.text}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Nutrition Information */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Nutrition Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Calories</p>
                <p className="font-semibold">{recipe.nutrition.calories}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Carbs</p>
                <p className="font-semibold">{recipe.nutrition.carbs}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Protein</p>
                <p className="font-semibold">{recipe.nutrition.protein}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 text-sm">Fat</p>
                <p className="font-semibold">{recipe.nutrition.fat}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}