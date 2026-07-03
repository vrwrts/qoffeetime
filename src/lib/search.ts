export type RecipeSearch = {
    output?: number;
    ratio?: number;
};

const num = (value: unknown): number | undefined => {
    if (value === undefined || value === null || value === '') return undefined;
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
};

/**
 * Type-safe search-param parser for the recipe routes. Replaces the previous
 * `queryArgToNumber` handling of `output`/`ratio` query strings.
 */
export const validateRecipeSearch = (
    search: Record<string, unknown>,
): RecipeSearch => ({
    output: num(search.output),
    ratio: num(search.ratio),
});
