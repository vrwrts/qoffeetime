import { useCallback, useState } from 'react';

/**
 * Minimal localStorage-backed state hook. Serializes with JSON (matching the
 * previous `rooks` behaviour) so existing installs keep their stored values.
 */
export function useLocalStorage<T>(
    key: string,
    defaultValue?: T,
): [T | undefined, (value: T | undefined) => void] {
    const [value, setValue] = useState<T | undefined>(() => {
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? (JSON.parse(raw) as T) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    const set = useCallback(
        (next: T | undefined) => {
            setValue(next);
            try {
                localStorage.setItem(key, JSON.stringify(next));
            } catch {
                // Ignore write errors (e.g. storage disabled or full).
            }
        },
        [key],
    );

    return [value, set];
}
