import template from 'lodash.template';
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

export const applyTemplate = (string: string, data: Record<string, unknown>) =>
    template(string, { interpolate: /{{([\s\S]+?)}}/g })(data);

export const vibrate = (...pattern: number[]) => {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
};
