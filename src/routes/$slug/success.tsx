import { mdiCheck } from '@mdi/js';
import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import Confetti from 'react-canvas-confetti';

import Button from '../../components/Button';
import BuyMeACoffee from '../../components/BuyMeACoffee';
import LargeIcon from '../../components/LargeIcon';
import FooterLayout from '../../layouts/FooterLayout';
import MainLayout from '../../layouts/MainLayout';
import NavLayout from '../../layouts/NavLayout';
import { APP_NAME, APP_TITLE } from '../../lib/constants';
import { vibrate } from '../../lib/helpers';
import { getRecipe } from '../../lib/recipes';
import { validateRecipeSearch } from '../../lib/search';
import type { RecipeSettings } from '../../lib/types';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { useLocalStorage } from '../../lib/useLocalStorage';

const SuccessPage = () => {
    const { defaultRatio, minOutput, name, slug } = Route.useLoaderData();
    const { output: outputParam, ratio: ratioParam } = Route.useSearch();

    useDocumentTitle(`${name} – ${APP_TITLE}`);

    const [previousSettings, setLatestSettings] =
        useLocalStorage<RecipeSettings>(slug);
    const [, setLatest] = useLocalStorage<string>('latest');

    const output = outputParam || previousSettings?.output || minOutput;
    const ratio = ratioParam || previousSettings?.ratio || defaultRatio;

    const [shouldFire, setShouldFire] = useState(false);

    // On mount: fire the confetti, persist this brew's settings, and mark it
    // as the most recently used recipe.
    useEffect(() => {
        setShouldFire(true);
        setLatestSettings({ output, ratio });
        setLatest(slug);
    }, [output, ratio, slug, setLatest, setLatestSettings]);

    return (
        <>
            <NavLayout />
            <MainLayout>
                <Confetti
                    className="fixed inset-0 z-0 w-full h-full"
                    disableForReducedMotion
                    fire={shouldFire}
                    onFire={() => setShouldFire(false)}
                    origin={{ x: 0.5, y: 0.3 }}
                    particleCount={75}
                    spread={60}
                    ticks={600}
                />
                <section className="flex-1 flex flex-col items-center justify-center z-10">
                    <LargeIcon
                        icon={mdiCheck}
                        onClick={() => {
                            vibrate(50);
                            setShouldFire(true);
                        }}
                    />
                </section>
                <section className="flex-1 flex flex-col justify-center">
                    <h1 className="text-3xl font-semibold text-center">
                        All done, enjoy your {name}!
                    </h1>
                </section>
                <section className="flex-1" />
            </MainLayout>
            <FooterLayout>
                <p className="text-center text-xs opacity-80">
                    Enjoying{' '}
                    <span className="inline-block first-letter:uppercase">
                        {APP_NAME}
                    </span>
                    ?
                </p>
                <a
                    className="inline-block w-full py-3 opacity-90"
                    href="https://www.buymeacoffee.com/nielsbik"
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    <BuyMeACoffee className="w-2/6 mx-auto" />
                </a>
                <Link to="/" replace>
                    <Button>Continue</Button>
                </Link>
            </FooterLayout>
        </>
    );
};

export const Route = createFileRoute('/$slug/success')({
    validateSearch: validateRecipeSearch,
    loader: ({ params }) => {
        const recipe = getRecipe(params.slug);
        if (!recipe) throw notFound();
        return recipe;
    },
    component: SuccessPage,
});
