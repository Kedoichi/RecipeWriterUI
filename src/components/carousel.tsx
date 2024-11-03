"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Recipe } from "@/lib/types/recipe";

interface CarouselProps {
  recipes: Recipe[];
}

export function RecipeCarousel({ recipes }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentRecipe = recipes[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % recipes.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + recipes.length) % recipes.length);
  };

  return (
    <div className="relative bg-black/[.05] dark:bg-white/[.06] rounded-2xl overflow-hidden">
      {/* Image Section */}
      <div className="relative h-[400px] w-full">
        <Image
          src={currentRecipe.image}
          alt={currentRecipe.title}
          fill
          className="object-cover"
          priority
        />
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Previous recipe"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          aria-label="Next recipe"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Recipe Info */}
      <div className="p-8">
        <Link href={`/recipes/${currentRecipe.id}`}>
          <h2 className="text-3xl font-bold mb-4 hover:text-blue-600 transition-colors">
            {currentRecipe.title}
          </h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {currentRecipe.description}
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-black/[.03] dark:bg-white/[.03] p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Time</p>
            <p className="font-semibold">{currentRecipe.preparationTime.total}</p>
          </div>
          <div className="bg-black/[.03] dark:bg-white/[.03] p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Calories</p>
            <p className="font-semibold">{currentRecipe.nutrition.calories}</p>
          </div>
          <div className="bg-black/[.03] dark:bg-white/[.03] p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
            <p className="font-semibold">{currentRecipe.nutrition.protein}</p>
          </div>
          <div className="bg-black/[.03] dark:bg-white/[.03] p-4 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
            <p className="font-semibold">{currentRecipe.nutrition.carbs}</p>
          </div>
        </div>

        {/* View Recipe Button */}
        <div className="text-center">
          <Link
            href={`/recipes/${currentRecipe.id}`}
            className="inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3 hover:bg-[#383838] transition-colors"
          >
            View Full Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}