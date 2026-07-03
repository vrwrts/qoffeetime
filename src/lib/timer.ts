import { useCallback, useEffect, useRef, useState } from 'react';
import {
    applyTemplate,
    formatTime,
    round,
    toMilliseconds,
    vibrate,
} from './helpers';
import type { ParsedRecipeStep, RecipeStep } from './types';

import { useWakeLock as useWakeLockHook } from './wakelock';

type TickFunction = (elapsed: number, delta: number) => void;

export const useAnimationFrame = (onFrame: TickFunction) => {
    const elapsed = useRef(0);
    const frame = useRef<number | null>(null);
    const init = useRef(Date.now());
    const last = useRef(Date.now());
    const [isRunning, setRunning] = useState(false);
    const [isReset, setReset] = useState(true);

    const animate = () => {
        const now = Date.now();
        const delta = now - last.current;
        elapsed.current += delta;

        // Set the running state:
        if (!isRunning) {
            setRunning(true);
        }

        // Set the reset state:
        if (elapsed.current > 0 && isReset) {
            setReset(false);
        }

        // Call user defined `onFrame` function:
        onFrame(elapsed.current, delta);

        last.current = now;
        frame.current = requestAnimationFrame(animate);
    };

    const start = () => {
        if (!frame.current) {
            init.current = Date.now();
            last.current = Date.now();
            frame.current = requestAnimationFrame(animate);
        }
    };

    const stop = () => {
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = null;
        setRunning(false);
    };

    // Stop the animation when the component unmounts:
    useEffect(() => {
        return stop;
    }, []);

    return {
        isReset,
        isRunning,
        start,
        stop,
    };
};

export const useBrewTimer = (
    rawSteps: RecipeStep[],
    output: number,
    ratio: number,
) => {
    const [isComplete, setComplete] = useState(false);

    const coffee = round((ratio / 1000) * output);
    const targetVars = { coffee, output };
    const steps = parseSteps(rawSteps, targetVars);
    const total = sumUntil(steps);

    const [current, setCurrent] = useState(0);
    const [remainingCurrent, setRemainingCurrent] = useState(
        formatTime(steps[current].duration),
    );
    const [remainingTotal, setRemainingTotal] = useState(formatTime(total));
    const [weight, setWeight] = useState(0);

    const onFrame = useCallback<TickFunction>(
        (animationElapsed) => {
            // Cap the elapsed value at the total duration of the timer:
            const elapsed = Math.min(animationElapsed, total);

            // Update the total remaining time:
            const remainingTotal = Math.max(total - elapsed, 0);
            setRemainingTotal(formatTime(remainingTotal));

            // Find the currently active step:
            const current = findCurrent(steps, elapsed);
            const last = steps.length - 1;
            const next = Math.min(current + 1, last);
            const previous = Math.max(current - 1, 0);

            // Compute the remaining time within the current step:
            const totalIncludingCurrent = sumUntil(steps, current);
            const remainingCurrent = Math.max(
                totalIncludingCurrent - elapsed,
                0,
            );

            // If there's less than half a second left in the current step,
            // we mark the next step as being the current:
            if (remainingCurrent < 500 && current !== last) {
                setCurrent(current + 1);
                setRemainingCurrent(formatTime(steps[next].duration));
            }
            // If there's no more time left and this is the final step,
            // mark the timer as complete:
            else if (remainingCurrent === 0 && current === last) {
                setComplete(true);
                animation.stop();
                return;
            }
            // Otherwise, just update the values as normal:
            else {
                setCurrent(current);
                setRemainingCurrent(formatTime(remainingCurrent));
            }

            // Compute the progress of the current step:
            // Note that here, we ignore our intervention from above so that
            // the weight doesn't jump as we artifically start the next step.
            const progressCurrent = Math.max(
                1 - remainingCurrent / steps[current].duration,
                0,
            );

            // Compute the current target weight:
            const weightCurrent = steps[current].target;
            const weightPrevious = current === 0 ? 0 : steps[previous].target;
            const weightToAdd = weightCurrent - weightPrevious;
            const weight = weightPrevious + progressCurrent * weightToAdd;
            setWeight(round(weight));
        },
        [steps, total],
    );
    const animation = useAnimationFrame(onFrame);

    // Softly vibrate whenever we move on to the next step:
    useEffect(() => {
        if (current !== 0) {
            // Vibrate longer if the step that just ended was longer than a minute:
            if (steps[Math.max(current - 1, 0)].duration > 60000) {
                vibrate(500);
            } else {
                vibrate(50);
            }
        }
    }, [current]);

    return {
        ...animation,
        current,
        isComplete,
        remainingCurrent,
        remainingTotal,
        steps,
        weight,
    };
};

const findCurrent = (steps: ParsedRecipeStep[], elapsed: number): number =>
    steps.findIndex((_, i) => elapsed <= sumUntil(steps, i));

const parseSteps = (
    steps: RecipeStep[],
    targetVars: Record<string, number>,
): ParsedRecipeStep[] =>
    steps.reduce<ParsedRecipeStep[]>((res, step, i) => {
        const previousTarget = res[Math.max(i - 1, 0)]?.target || 0;
        const target = parseInt(
            step.target
                ? applyTemplate(step.target, { ...targetVars, previousTarget })
                : '',
            10,
        );
        const toAdd = target ? target - previousTarget : 0;
        const description = applyTemplate(step.description, { target, toAdd });
        const duration = toMilliseconds(step.duration);

        res.push({
            ...step,
            description,
            duration,
            target: target || previousTarget,
        });
        return res;
    }, []);

// FIXME: Steps shouldn't *have* to be parsed when calling this, but I don't know
// how to not force this with TypeScript
// TODO: Make sure field can only be the keys within the steps object that are numbers
const sumUntil = (
    steps: ParsedRecipeStep[],
    index: number = steps.length - 1,
    field: 'duration' | 'target' = 'duration',
): number =>
    steps
        .slice(0, Math.min(index + 1, steps.length))
        .reduce((total: number, step) => total + (step[field] || 0), 0);

export const useWakeLock = () => {
    const { request, release } = useWakeLockHook();

    const visibilityChangeHandler = () => {
        if (!document.hidden) request();
        else release();
    };

    useEffect(() => {
        request();
        document.addEventListener('visibilitychange', visibilityChangeHandler);

        return () => {
            release();
            document.removeEventListener(
                'visibilitychange',
                visibilityChangeHandler,
            );
        };
    }, []);
};
