import { Link } from '@tanstack/react-router';
import classNames from 'classnames';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect } from 'react';

import { insertBreakAtCapital } from '../lib/helpers';
import type { Recipe } from '../lib/types';

type SliderRecipe = {
    latest?: {
        output: number;
        ratio: number;
    };
    name: Recipe['name'];
    slug: Recipe['slug'];
    tagline: Recipe['tagline'];
};

const RecipeSlide = ({ latest, slug, tagline, ...recipe }: SliderRecipe) => {
    // Insert `<wbr />` tags within words containing multiple capitals:
    const name = insertBreakAtCapital(recipe.name);

    return (
        <Link
            to="/$slug"
            params={{ slug }}
            search={
                latest ? { output: latest.output, ratio: latest.ratio } : {}
            }
        >
            <div className="h-full bg-brand relative">
                <img
                    alt={recipe.name}
                    className="absolute inset-0 h-full w-full object-cover object-center mix-blend-multiply opacity-60 rounded"
                    src={`/assets/images/${slug}.jpg`}
                />
                <header className="absolute h-full flex flex-col justify-end p-4">
                    <h2 className="text-7xl font-bold w-5/6">{name}</h2>
                    <h3 className="text-lg mt-10 break-words h-full max-h-32">
                        {tagline}
                    </h3>
                </header>
            </div>
        </Link>
    );
};

type RecipeSliderProps = {
    onChange: (index: number) => void;
    pagination?: boolean;
    recipies: SliderRecipe[];
};

const SLIDE_WIDTH = 90;

const RecipeSlider = ({
    onChange,
    pagination = true,
    recipies,
}: RecipeSliderProps) => {
    const [emblaRef, embla] = useEmblaCarousel({ skipSnaps: true });

    // Helper function to safely get the currently selected index:
    const getSelectedIndex = useCallback(
        () => (embla ? embla.selectedScrollSnap() : 0),
        [embla],
    );

    // Call `onChange` when a slide is selected:
    const onSelect = useCallback(
        () => onChange(getSelectedIndex()),
        [getSelectedIndex, onChange],
    );

    // Listen to events so we can call `onChange`:
    useEffect(() => {
        if (!embla) return;

        // Listen for select events:
        embla.on('select', onSelect);

        // Stop listening when component unmounts:
        return () => {
            embla.off('select', onSelect);
        };
    }, [embla, onSelect]);

    return (
        <>
            <div className="overflow-hidden flex-1" ref={emblaRef}>
                <div
                    className="h-full grid grid-flow-col gap-3"
                    style={{
                        gridAutoColumns: `${SLIDE_WIDTH}%`,
                        transform: `translate3d(${
                            (100 - SLIDE_WIDTH) / 2
                        }vw, 0px, 0px)`,
                    }}
                >
                    {recipies.map((recipe) => (
                        <RecipeSlide key={recipe.slug} {...recipe} />
                    ))}
                </div>
            </div>
            {pagination && (
                <div className="mt-6 flex flex-row items-center justify-center">
                    {recipies.map(({ slug }, index) => {
                        const className = classNames(
                            'w-2.5 h-2.5 mr-2.5 last:mr-0 rounded-full border border-current',
                            {
                                'bg-transparent': index !== getSelectedIndex(),
                                'bg-current': index === getSelectedIndex(),
                            },
                        );
                        return <div className={className} key={slug} />;
                    })}
                </div>
            )}
        </>
    );
};

export default RecipeSlider;
