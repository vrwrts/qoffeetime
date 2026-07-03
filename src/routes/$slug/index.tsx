import {
    createFileRoute,
    Link,
    notFound,
    useNavigate,
} from '@tanstack/react-router';
import { useCallback } from 'react';

import BackButton from '../../components/BackButton';
import Button from '../../components/Button';
import RatioSlider from '../../components/RatioSlider';
import RatioSliderHint from '../../components/RatioSliderHint';
import FooterLayout from '../../layouts/FooterLayout';
import MainLayout from '../../layouts/MainLayout';
import NavLayout from '../../layouts/NavLayout';
import { APP_TITLE } from '../../lib/constants';
import { getRecipe } from '../../lib/recipes';
import { validateRecipeSearch } from '../../lib/search';
import type { RecipeSettings } from '../../lib/types';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { useLocalStorage } from '../../lib/useLocalStorage';

const SLIDER_HEIGHT = 320;

const RecipePage = () => {
    const { defaultRatio, maxOutput, minOutput, name, slug } =
        Route.useLoaderData();
    const { output: outputParam, ratio: ratioParam } = Route.useSearch();
    const navigate = useNavigate();

    useDocumentTitle(`${name} – ${APP_TITLE}`);

    // Combine URL search params, previously stored settings, and recipe defaults:
    const [previousSettings] = useLocalStorage<RecipeSettings>(slug);
    const output = outputParam || previousSettings?.output || minOutput;
    const ratio = ratioParam || previousSettings?.ratio || defaultRatio;

    // Show the hint on the ratio slider the first time a recipe has adjustable
    // settings:
    const [seenHint, setSeenHint] = useLocalStorage<boolean>(
        'seenRatioSliderHint',
        false,
    );
    const hasSettings = minOutput !== maxOutput;
    const shouldShowHint = hasSettings && !seenHint;
    const onDismiss = () => setSeenHint(true);

    // Push updated output/ratio into the URL when the slider is released:
    const onCommit = useCallback(
        (nextOutput: number, nextRatio: number) =>
            navigate({
                to: '/$slug',
                params: { slug },
                search: { output: nextOutput, ratio: nextRatio },
                replace: true,
            }),
        [navigate, slug],
    );

    return (
        <>
            <NavLayout>
                <BackButton />
            </NavLayout>
            <MainLayout>
                <h1 className="text-5xl font-bold">{name}</h1>
                <section>
                    <RatioSlider
                        height={SLIDER_HEIGHT}
                        maxOutput={maxOutput}
                        minOutput={minOutput}
                        onCommit={onCommit}
                        output={output}
                        ratio={ratio}
                    />
                    <RatioSliderHint
                        height={SLIDER_HEIGHT}
                        isOpen={shouldShowHint}
                        onDismiss={onDismiss}
                    />
                </section>
                <section className="prose">
                    <h4>Recommended ratio: {defaultRatio}&nbsp;g/l</h4>
                    <p>
                        Increasing the ratio will use more coffee and produce a
                        stronger cup. Your current ratio setting is {ratio}
                        &nbsp;g/l.
                    </p>
                </section>
            </MainLayout>
            <FooterLayout>
                {ratio !== defaultRatio && (
                    <Button
                        onClick={() =>
                            navigate({
                                to: '/$slug',
                                params: { slug },
                                search: { output, ratio: defaultRatio },
                                replace: true,
                            })
                        }
                        variant="text"
                    >
                        Reset ratio
                    </Button>
                )}
                <Link
                    to="/$slug/timer"
                    params={{ slug }}
                    search={{ output, ratio }}
                >
                    <Button>Next</Button>
                </Link>
            </FooterLayout>
        </>
    );
};

export const Route = createFileRoute('/$slug/')({
    validateSearch: validateRecipeSearch,
    loader: ({ params }) => {
        const recipe = getRecipe(params.slug);
        if (!recipe) throw notFound();
        return recipe;
    },
    component: RecipePage,
});
