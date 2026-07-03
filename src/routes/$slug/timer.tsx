import { mdiPause, mdiPlayOutline, mdiStop } from '@mdi/js';
import { createFileRoute, notFound, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

import BackButton from '../../components/BackButton';
import Button, { ButtonGroup } from '../../components/Button';
import CurrentStepDetails from '../../components/CurrentStepDetails';
import GoBack from '../../components/GoBack';
import StepsList from '../../components/StepsList';
import TimerStat from '../../components/TimerStat';
import FooterLayout from '../../layouts/FooterLayout';
import MainLayout from '../../layouts/MainLayout';
import NavLayout from '../../layouts/NavLayout';
import { APP_TITLE } from '../../lib/constants';
import { getRecipe } from '../../lib/recipes';
import { validateRecipeSearch } from '../../lib/search';
import { useBrewTimer, useWakeLock } from '../../lib/timer';
import type { RecipeSettings } from '../../lib/types';
import { useDocumentTitle } from '../../lib/useDocumentTitle';
import { useLocalStorage } from '../../lib/useLocalStorage';

const confirmMessage = 'Do you want to cancel the timer?';

const TimerPage = () => {
    const recipe = Route.useLoaderData();
    const { defaultRatio, minOutput, name, slug } = recipe;
    const { output: outputParam, ratio: ratioParam } = Route.useSearch();
    const navigate = useNavigate();

    useDocumentTitle(`${name} – ${APP_TITLE}`);

    const [previousSettings] = useLocalStorage<RecipeSettings>(slug);
    const output = outputParam || previousSettings?.output || minOutput;
    const ratio = ratioParam || previousSettings?.ratio || defaultRatio;

    const {
        current,
        isComplete,
        isReset,
        isRunning,
        remainingCurrent,
        remainingTotal,
        start,
        steps,
        stop,
        weight,
    } = useBrewTimer(recipe.steps, output, ratio);

    // Once the timer completes, show the success page:
    useEffect(() => {
        if (isComplete) {
            navigate({
                to: '/$slug/success',
                params: { slug },
                search: { output, ratio },
                replace: true,
            });
        }
    }, [isComplete, navigate, output, ratio, slug]);

    // Keep the screen on while this page is rendered:
    useWakeLock();

    return (
        <>
            <NavLayout>
                <BackButton confirm={isRunning ? confirmMessage : undefined} />
            </NavLayout>
            <MainLayout>
                <header className="grid grid-flow-col auto-cols-fr">
                    <TimerStat
                        as="time"
                        label="total left"
                        value={remainingTotal}
                    />
                    <TimerStat label="current weight" value={`${weight} g`} />
                </header>
                <section className="mx-4 my-6">
                    <CurrentStepDetails
                        description={steps[current].description}
                        remaining={remainingCurrent}
                    />
                </section>
                <section className="overflow-auto mt-4">
                    <StepsList currentIndex={current} steps={steps} />
                </section>
            </MainLayout>
            <FooterLayout>
                <ButtonGroup>
                    <Button
                        hidden={isRunning}
                        icon={mdiPlayOutline}
                        inGroup={!isReset}
                        onClick={() => start()}
                    >
                        Start
                    </Button>
                    <Button
                        hidden={!isRunning}
                        icon={mdiPause}
                        inGroup={!isReset}
                        onClick={() => stop()}
                    >
                        Pause
                    </Button>
                    <GoBack confirm={isRunning ? confirmMessage : undefined}>
                        <Button
                            hidden={isReset}
                            icon={mdiStop}
                            inGroup
                            variant="dark"
                        >
                            Stop
                        </Button>
                    </GoBack>
                </ButtonGroup>
            </FooterLayout>
        </>
    );
};

export const Route = createFileRoute('/$slug/timer')({
    validateSearch: validateRecipeSearch,
    loader: ({ params }) => {
        const recipe = getRecipe(params.slug);
        if (!recipe) throw notFound();
        return recipe;
    },
    component: TimerPage,
});
