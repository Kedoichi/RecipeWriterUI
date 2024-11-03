import Link from "next/link";
import { Plus } from "lucide-react";
import { DUMMY_RECIPES } from "@lib/data/recipe";
import { RecipeCarousel } from "@components/carousel";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen p-8 gap-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center max-w-7xl mx-auto w-full">
        <Link href="/">
          <h1 className="text-2xl font-bold">Recipe Book</h1>
        </Link>
        <Link
          href="/recipes/create"
          className="flex items-center gap-2 bg-foreground text-background rounded-full px-4 py-2 hover:bg-[#383838] transition-colors"
        >
          <Plus size={20} />
          Add Recipe
        </Link>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full">
        <RecipeCarousel recipes={DUMMY_RECIPES} />
      </main>

      {/* Footer */}
      <footer className="flex gap-6 justify-center items-center py-8 text-sm text-gray-600 dark:text-gray-400">
        <Link href="/recipes" className="hover:underline hover:underline-offset-4">
          All Recipes
        </Link>
        <Link href="/about" className="hover:underline hover:underline-offset-4">
          About
        </Link>
        <Link href="/contact" className="hover:underline hover:underline-offset-4">
          Contact
        </Link>
      </footer>
    </div>
  );
}