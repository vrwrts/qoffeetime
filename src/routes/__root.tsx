import { mdiCoffeeOffOutline } from '@mdi/js';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

import ApplePWAPrompt from '../components/ApplePWAPrompt';
import Button from '../components/Button';
import LargeIcon from '../components/LargeIcon';
import FooterLayout from '../layouts/FooterLayout';
import FullHeightLayout from '../layouts/FullHeightLayout';

// Keep the app sized to the visible viewport (handles mobile browser chrome).
const updateHeight = () => {
    document.body.style.height = `${window.innerHeight}px`;
};

const RootComponent = () => {
    useEffect(() => {
        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return (
        <>
            <ApplePWAPrompt />
            <Outlet />
        </>
    );
};

const NotFound = () => (
    <>
        <FullHeightLayout align="full" className="px-6">
            <section className="flex-1" />
            <section className="flex-1 flex flex-col items-center justify-center">
                <LargeIcon icon={mdiCoffeeOffOutline} />
            </section>
            <section className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl font-semibold text-center">
                    We couldn't find that recipe.
                </h1>
            </section>
            <section className="flex-1" />
        </FullHeightLayout>
        <FooterLayout>
            <Link to="/">
                <Button>Back to recipes</Button>
            </Link>
        </FooterLayout>
    </>
);

export const Route = createRootRoute({
    component: RootComponent,
    notFoundComponent: NotFound,
});
