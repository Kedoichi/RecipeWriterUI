"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Minus, Save, Loader2, Upload } from "lucide-react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Notification } from "@/components/notification";

// Validation schema
const recipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().optional(),
  preparationTime: z.object({
    total: z.string().min(1, "Total time is required"),
    preparation: z.string().min(1, "Preparation time is required"),
    cooking: z.string().min(1, "Cooking time is required"),
  }),
  ingredients: z.array(
    z.string().min(3, "Ingredient must be at least 3 characters")
  ),
  instructions: z.array(
    z.object({
      step: z.number(),
      text: z.string().min(5, "Instruction must be at least 5 characters"),
    })
  ),
  nutrition: z.object({
    calories: z.string().min(1, "Calories are required"),
    carbs: z.string().min(1, "Carbs are required"),
    protein: z.string().min(1, "Protein is required"),
    fat: z.string().min(1, "Fat is required"),
  }),
});

interface FormErrors {
  [key: string]: string;
}

interface Instruction {
  step: number;
  text: string;
}

interface PreparationTime {
  total: string;
  preparation: string;
  cooking: string;
}

interface Nutrition {
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
}

interface RecipeForm {
  title: string;
  description: string;
  preparationTime: PreparationTime;
  ingredients: string[];
  instructions: Instruction[];
  nutrition: Nutrition;
}

export default function CreateRecipePage() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [createdRecipeId, setCreatedRecipeId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [recipe, setRecipe] = useState<RecipeForm>({
    title: "",
    description: "",
    preparationTime: {
      total: "",
      preparation: "",
      cooking: "",
    },
    ingredients: [""],
    instructions: [{ step: 1, text: "" }],
    nutrition: {
      calories: "",
      carbs: "",
      protein: "",
      fat: "",
    },
  });

  // Image upload handling
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors({ image: "Please upload an image file" });
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 25 * 1024 * 1024) {
      setErrors({ image: "Image must be less than 25MB" });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Here you would typically upload to your storage service
    // For now, we'll just store the preview URL
    setRecipe((prev) => ({ ...prev, image: previewImage }));
  };

  // Form validation
  const validateForm = (): boolean => {
    try {
      recipeSchema.parse(recipe);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: FormErrors = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        console.log("Validation errors:", newErrors); // Log the errors
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Attempting to submit:", recipe);

    if (!validateForm()) {
      console.log("Validation failed:", errors);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Simulating API call...");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Recipe submitted:", recipe);
      const newRecipeId = "123"; // This would come from your API
      setCreatedRecipeId(newRecipeId);
      setShowNotification(true);
      setTimeout(() => {
        router.push(`/recipes/${newRecipeId}`);
      }, 3000);
    } catch (error) {
      console.error("Error submitting recipe:", error);
      setErrors({ submit: "Failed to submit recipe. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setRecipe((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof RecipeForm] as Record<string, string>),
          [child]: value,
        },
      }));
    } else {
      setRecipe((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleIngredientChange = (index: number, value: string) => {
    setRecipe((prev) => {
      const newIngredients = [...prev.ingredients];
      newIngredients[index] = value;
      return { ...prev, ingredients: newIngredients };
    });
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleInstructionChange = (index: number, value: string) => {
    setRecipe((prev) => {
      const newInstructions = [...prev.instructions];
      newInstructions[index] = { step: index + 1, text: value };
      return { ...prev, instructions: newInstructions };
    });
  };

  const addInstruction = () => {
    setRecipe((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { step: prev.instructions.length + 1, text: "" },
      ],
    }));
  };

  const removeInstruction = (index: number) => {
    setRecipe((prev) => {
      const filteredInstructions = prev.instructions
        .filter((_, i) => i !== index)
        .map((instruction, i) => ({ ...instruction, step: i + 1 }));
      return { ...prev, instructions: filteredInstructions };
    });
  };

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
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image Upload */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Recipe Image</h2>
            <div className="flex flex-col items-center">
              {previewImage ? (
                <div className="relative w-full h-[300px] mb-4">
                  <img
                    src={previewImage}
                    alt="Recipe preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewImage("");
                      setRecipe((prev) => ({ ...prev, image: "" }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="w-full h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500">
                  <Upload size={48} className="text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    Click or drag image to upload
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>
          </div>
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="title"
                  value={recipe.title}
                  onChange={handleInputChange}
                  placeholder="Recipe Title"
                  className={`w-full p-3 border rounded-lg ${
                    errors.title ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <textarea
                  name="description"
                  value={recipe.description}
                  onChange={handleInputChange}
                  placeholder="Recipe Description"
                  className={`w-full p-3 border rounded-lg h-24 ${
                    errors.description ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Preparation Time */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preparation Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Total Time
                </label>
                <input
                  type="text"
                  name="preparationTime.total"
                  value={recipe.preparationTime.total}
                  onChange={handleInputChange}
                  placeholder="e.g., 30 minutes"
                  className="w-full p-3 border rounded-lg"
                />
                {errors["preparationTime.total"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["preparationTime.total"]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Prep Time
                </label>
                <input
                  type="text"
                  name="preparationTime.preparation"
                  value={recipe.preparationTime.preparation}
                  onChange={handleInputChange}
                  placeholder="e.g., 10 minutes"
                  className="w-full p-3 border rounded-lg"
                />
                {errors["preparationTime.preparation"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["preparationTime.preparation"]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Cooking Time
                </label>
                <input
                  type="text"
                  name="preparationTime.cooking"
                  value={recipe.preparationTime.cooking}
                  onChange={handleInputChange}
                  placeholder="e.g., 20 minutes"
                  className="w-full p-3 border rounded-lg"
                />
                {errors["preparationTime.cooking"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["preparationTime.cooking"]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ingredients</h2>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  placeholder={`Ingredient ${index + 1}`}
                  className={`flex-1 p-3 border rounded-lg ${
                    errors[`ingredients.${index}`] ? "border-red-500" : ""
                  }`}
                  required
                />
                {errors[`ingredients.${index}`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`ingredients.${index}`]}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  disabled={recipe.ingredients.length === 1}
                >
                  <Minus size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
            >
              <Plus size={20} />
              Add Ingredient
            </button>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Instructions</h2>
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="flex gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shrink-0">
                  {instruction.step}
                </span>
                <input
                  type="text"
                  value={instruction.text}
                  onChange={(e) =>
                    handleInstructionChange(index, e.target.value)
                  }
                  placeholder={`Step ${index + 1}`}
                  className="flex-1 p-3 border rounded-lg"
                  required
                />
                {errors[`instructions.${index}.text`] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[`instructions.${index}.text`]}
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  disabled={recipe.instructions.length === 1}
                >
                  <Minus size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="flex items-center gap-2 text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
            >
              <Plus size={20} />
              Add Step
            </button>
          </div>

          {/* Nutrition Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Nutrition Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Calories
                </label>
                <input
                  type="text"
                  name="nutrition.calories"
                  value={recipe.nutrition.calories}
                  onChange={handleInputChange}
                  placeholder="e.g., 300kcal"
                  className="w-full p-3 border rounded-lg"
                />
                {errors["nutrition.calories"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["nutrition.calories"]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Carbs
                </label>
                <input
                  type="text"
                  name="nutrition.carbs"
                  value={recipe.nutrition.carbs}
                  onChange={handleInputChange}
                  placeholder="e.g., 30g"
                  className="w-full p-3 border rounded-lg"
                />
                {errors["nutrition.carbs"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["nutrition.carbs"]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Protein
                </label>
                <input
                  type="text"
                  name="nutrition.protein"
                  value={recipe.nutrition.protein}
                  onChange={handleInputChange}
                  placeholder="e.g., 20g"
                  className="w-full p-3 border rounded-lg"
                />
                {errors["nutrition.protein"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["nutrition.protein"]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Fat</label>
                <input
                  type="text"
                  name="nutrition.fat"
                  value={recipe.nutrition.fat}
                  onChange={handleInputChange}
                  placeholder="e.g., 10g"
                  className="w-full p-3 border rounded-lg"
                />
                {errors["nutrition.fat"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["nutrition.fat"]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-4 rounded-lg flex items-center justify-center gap-2
              ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } 
              text-white`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving Recipe...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Recipe
              </>
            )}
          </button>

          {errors.submit && (
            <p className="text-red-500 text-center mt-2">{errors.submit}</p>
          )}
        </form>
      </div>
      <Notification
        message="Recipe saved successfully! Redirecting..."
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
}
