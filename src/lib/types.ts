export type RecipeStep = {
    description: string;
    duration: number;
    target?: string;
};

export type ParsedRecipeStep = {
    description: string;
    duration: number;
    target: number;
};

export type RecipeFromFile = {
    name: string;
    tagline: string;
    maxOutput: number;
    minOutput: number;
    defaultRatio: number;
    steps: RecipeStep[];
    // tips: string[];
};

export type Recipe = RecipeFromFile & {
    slug: string;
};

export type RecipeSettings = {
    output: number;
    ratio: number;
};
