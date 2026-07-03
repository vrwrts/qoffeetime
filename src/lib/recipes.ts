import type { Recipe, RecipeFromFile } from './types';

// Bundle every recipe JSON at build time (replaces the previous fs.readFileSync
// approach that only worked during Next.js static generation).
const modules = import.meta.glob<{ default: RecipeFromFile }>(
    '../data/recipes/*.json',
    { eager: true },
);

const bySlug: Record<string, Recipe> = {};
for (const path in modules) {
    const slug = (path.split('/').pop() ?? '').replace('.json', '');
    bySlug[slug] = { ...modules[path].default, slug };
}

export const recipeMap = bySlug;

export const allRecipes: Recipe[] = Object.values(bySlug).sort((a, b) =>
    a.name.localeCompare(b.name),
);

export const getRecipe = (slug: string): Recipe | undefined => bySlug[slug];
