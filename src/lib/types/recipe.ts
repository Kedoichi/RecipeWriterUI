export type Recipe = {
    id: string;
    title: string;
    description: string;
    image: string;
    preparationTime: {
      total: string;
      preparation: string;
      cooking: string;
    };
    ingredients: string[];
    instructions: {
      step: number;
      text: string;
    }[];
    nutrition: {
      calories: string;
      carbs: string;
      protein: string;
      fat: string;
    };
  }