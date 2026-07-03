import { useLayoutEffect, useRef, useState } from 'react';

/**
 * Tracks the bounding client rect of an element, remeasuring on resize/scroll.
 * Replaces `rooks`' `useBoundingclientrectRef`.
 */
export function useBoundingClientRect<T extends Element>() {
    const ref = useRef<T>(null);
    const [rect, setRect] = useState<DOMRect | null>(null);

    useLayoutEffect(() => {
        const measure = () => {
            if (ref.current) setRect(ref.current.getBoundingClientRect());
        };
        measure();
        window.addEventListener('resize', measure);
        window.addEventListener('scroll', measure, true);
        return () => {
            window.removeEventListener('resize', measure);
            window.removeEventListener('scroll', measure, true);
        };
    }, []);

    return [ref, rect] as const;
}
