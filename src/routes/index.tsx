import { createFileRoute, Link } from '@tanstack/react-router';
import { useCallback, useMemo, useState } from 'react';

import Button from '../components/Button';
import RecipeSlider from '../components/RecipeSlider';
import FooterLayout from '../layouts/FooterLayout';
import FullHeightLayout from '../layouts/FullHeightLayout';
import { APP_TITLE } from '../lib/constants';
import { allRecipes } from '../lib/recipes';
import type { Recipe } from '../lib/types';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { useLocalStorage } from '../lib/useLocalStorage';

const byLatestFirst =
    (latest: string | undefined) => (a: Recipe, b: Recipe) => {
        if (latest) {
            if (a.slug === latest) return -1;
            if (b.slug === latest) return 1;
        }
        return a.name.localeCompare(b.name);
    };

const IndexPage = () => {
    useDocumentTitle(APP_TITLE);

    const [latest] = useLocalStorage<string>('latest');

    // Sort the last-used recipe first (state is fully client-side, so unlike
    // the old Next.js version there's no hydration mismatch to work around).
    const recipes = useMemo(
        () => [...allRecipes].sort(byLatestFirst(latest)),
        [latest],
    );

    const [selected, setSelected] = useState(recipes[0]);
    const onChange = useCallback(
        (index: number) => setSelected(recipes[index]),
        [recipes],
    );

    return (
        <>
            <FullHeightLayout className="pt-6">
                <RecipeSlider onChange={onChange} recipies={recipes} />
            </FullHeightLayout>
            <FooterLayout>
                <Link to="/$slug" params={{ slug: selected.slug }}>
                    <Button>Brew {selected.name}</Button>
                </Link>
            </FooterLayout>
        </>
    );
};

export const Route = createFileRoute('/')({
    component: IndexPage,
});
