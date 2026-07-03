import { Fragment } from 'react';

export const formatTime = (
    ms: number,
    padZeroMinutes: boolean = true,
    seconds = toSeconds(ms),
    h = Math.floor(seconds / 3600),
    m = Math.floor((seconds % 3600) / 60),
    s = seconds % 60,
    p = padZeroMinutes ? '0' : '',
) =>
    [h, m > 9 ? m : `${p}${m}`, s > 9 ? s : `0${s}`].filter((s) => s).join(':');

export const insertBreakAtCapital = (str: string) => {
    const split = str.split(/(?=[A-Z])/);

    return (
        <>
            {split.map((part, index) => {
                // Only insert when the part doesn't end with a space (it'll automatically break there without a hint)
                // and when it's not the last part (that one doesn't need breaking):
                if (part[part.length - 1] !== ' ' && index !== split.length - 1)
                    return (
                        <Fragment key={index}>
                            {part}
                            <wbr />
                        </Fragment>
                    );

                // Otherwise, just return the part:
                return part;
            })}
        </>
    );
};

export const round = (val: number, decimals: number = 0): number =>
    +val.toFixed(decimals);

export const toMilliseconds = (val: number) => val * 1000;

export const toSeconds = (val: number) => round(val / 1000);

// Evaluates `{{ expr }}` placeholders — which may contain arbitrary JS
// expressions like `{{ Math.ceil((coffee * 2) / 10) * 10 }}` — against `data`
// by turning the string into a template literal. The templates come from the
// app's own recipe JSON (never user input); global helpers like `Math` resolve
// normally. Note: like the lodash.template it replaces, this relies on the
// Function constructor, so it needs `unsafe-eval` if a CSP is ever added.
export const applyTemplate = (
    string: string,
    data: Record<string, number>,
): string => {
    const literal = string.replace(
        /{{([\s\S]+?)}}/g,
        (_, expr: string) => `\${${expr}}`,
    );
    const render = new Function(
        ...Object.keys(data),
        `return \`${literal}\`;`,
    ) as (...values: number[]) => string;
    return render(...Object.values(data));
};

export const vibrate = (...pattern: number[]) => {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
};
