import classNames from 'classnames';
import { useEffect, useRef } from 'react';

import { formatTime } from '../lib/helpers';
import type { ParsedRecipeStep } from '../lib/types';

import StopWatch from './StopWatch';

type StepsListItemProps = {
    number: number;
    description: string;
    duration: number;
    isCurrent: boolean;
};

const StepsListItem = ({
    number,
    description,
    duration,
    isCurrent,
}: StepsListItemProps) => {
    const className = classNames('text-lg leading-5 text-white text-base', {
        'text-opacity-60': !isCurrent,
        'text-opacity-100': isCurrent,
        'font-semibold': isCurrent,
    });
    const ref = useRef<HTMLLIElement>(null);

    // Scroll the step into view the moment it becomes the current step:
    useEffect(() => {
        if (isCurrent) {
            ref.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [isCurrent]);

    return (
        <li className="flex flex-row items-center mb-3" ref={ref}>
            <span className="text-black text-opacity-30 font-bold flex-none mr-4">
                {number}
            </span>
            <StopWatch className="mr-4">
                {formatTime(duration, false)}
            </StopWatch>
            <p className={className}>{description}</p>
        </li>
    );
};

type StepsListProps = {
    currentIndex: number;
    steps: ParsedRecipeStep[];
};

const StepsList = ({ currentIndex, steps }: StepsListProps) => {
    return (
        <ol>
            {steps.map(({ ...step }, index) => (
                <StepsListItem
                    number={index + 1}
                    isCurrent={index === currentIndex}
                    key={index}
                    {...step}
                />
            ))}
        </ol>
    );
};

export default StepsList;
