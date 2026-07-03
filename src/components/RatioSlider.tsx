import {
    type MouseEvent as ReactMouseEvent,
    type TouchEvent as ReactTouchEvent,
    useCallback,
    useEffect,
    useState,
} from 'react';

import { round } from '../lib/helpers';
import { useBoundingClientRect } from '../lib/useBoundingClientRect';

type RatioSliderProps = {
    borderRadius?: number;
    className?: string;
    height?: number;
    maxOutput: number;
    maxRatio?: number;
    minFill?: number;
    minOutput: number;
    minRatio?: number;
    onCommit?: (output: number, ratio: number) => void;
    ratio: number;
    showHint?: boolean;
    width?: number;
    output: number;
};

type DraggingState = '' | 'left' | 'right';
type SliderPointerEvent =
    | ReactMouseEvent<SVGSVGElement>
    | ReactTouchEvent<SVGSVGElement>;

const COFFEE_STEP = 1;
const COFFEE_MAX_RATIO = 2 / 3;
const COFFEE_MIN_RATIO = 1 / 3;
const OUTPUT_STEP = 10;

const RatioSlider = ({
    borderRadius = 64,
    className,
    height = 320,
    maxOutput,
    maxRatio = 100,
    minFill = 0.5,
    minOutput,
    minRatio = 30,
    onCommit,
    width = 320,
    ...props
}: RatioSliderProps) => {
    // Positioning helper:
    const [svgRef, svgRect] = useBoundingClientRect<SVGSVGElement>();

    // Helper function to compute position within element:
    const getPosition = useCallback(
        (e: SliderPointerEvent) => {
            const point = 'touches' in e ? e.touches[0] : e;
            return {
                x: point.clientX - (svgRect?.left ?? 0),
                y: point.clientY - (svgRect?.top ?? 0),
            };
        },
        [svgRect],
    );

    // Keep internal value representations:
    const [ratio, setRatio] = useState(props.ratio);
    const [output, setOutput] = useState(props.output);

    // Update internal state if props change:
    useEffect(() => {
        setRatio(props.ratio);
        setOutput(props.output);
    }, [props.ratio, props.output]);

    // Keep which side user is ddragging on in state:
    const [side, setSide] = useState<DraggingState>('');

    // Definitions for clipPath shape:
    const clipPathPath = [
        'M', // Move to starting position
        width * (1 / 4) + borderRadius, // Starting X coordinate, top left corner
        height * (1 / 8), // Starting Y coordinate, top left corner
        'H', // Horizontal line
        width * (3 / 4) - borderRadius, // X coordinate, top right corner
        'q', // Rounded corner
        `${borderRadius},0 ${borderRadius},${borderRadius}`, // Top right rounded corner
        'V', // Vertical line
        height * (7 / 8) - borderRadius, // Y coordinate, bottom right corner
        'q', // Rounded corner
        `0,${borderRadius} -${borderRadius},${borderRadius}`, // Bottom right rounded corner
        'H', // Horizontal line
        width * (1 / 4) + borderRadius, // X coordinate, bottom left corner
        'q', // Rounded corner
        `${-borderRadius},0 -${borderRadius},-${borderRadius}`, // Bottom left rounded corner
        'V',
        height * (1 / 8) + borderRadius, // Ending Y coordinate, top left corner
        'q', // Rounded corner
        `0,-${borderRadius} ${borderRadius},-${borderRadius}`, // Top left rounded corner
        'z', // Shape end
    ].join(' ');

    // Definitions for background shape:
    const backgroundPath = [
        'M', // Move to starting position
        width * (1 / 4), // Starting X coordinate, top left corner
        height * (1 / 8), // Starting Y coordinate, top left corner
        'H', // Horizontal line
        width * (3 / 4), // X coordinate, top right corner
        'V', // Vertical line
        height * (7 / 8), // Y coordinate, bottom right corner
        'H', // Horizontal line
        width * (1 / 4), // X coordinate, bottom left corner
        'z', // Shape end
    ];

    // Definitions for output shape:
    const outputProgress = rangeProgressFromValue(output, minOutput, maxOutput);
    const outputRange = [(1 - minFill) * height, height * (1 / 8)];
    const outputPath = [
        'M', // Move to starting position
        width * (1 / 4), // Starting X coordinate, top left corner
        outputRange[0] - outputProgress * (outputRange[0] - outputRange[1]), // Starting Y coordinate, top left corner
        'H', // Horizontal line
        width * (3 / 4), // X coordinate, top right corner
        'V', // Vertical line
        height * (7 / 8), // Y coordinate, bottom right corner
        'H', // Horizontal line
        width * (1 / 4), // X coordinate, bottom left corner
        'z', // Shape end
    ];

    // Definitions for coffee shape:
    const coffeeProgress = rangeProgressFromValue(ratio, minRatio, maxRatio);
    const outputHeight = (outputPath[6] as number) - (outputPath[2] as number);
    const coffeeRange = [
        (outputPath[2] as number) + (1 - COFFEE_MIN_RATIO) * outputHeight,
        (outputPath[2] as number) + (1 - COFFEE_MAX_RATIO) * outputHeight,
    ];
    const coffeePath = [
        'M', // Move to starting position
        width * (1 / 4), // Starting X coordinate, top left corner
        round(
            coffeeRange[0] - coffeeProgress * (coffeeRange[0] - coffeeRange[1]),
        ), // Starting Y coordinate, top left corner
        'H', // Horizontal line
        width * (3 / 4), // X coordinate, top right corner
        'V', // Vertical line
        height * (7 / 8), // Y coordinate, bottom right corner
        'H', // Horizontal line
        width * (1 / 4), // X coordinate, bottom left corner
        'z', // Shape end
    ];

    // Definitions for output label:
    const visibleOutputHeight =
        (coffeePath[2] as number) - (outputPath[2] as number);
    const outputLabelPosition = {
        dx: -10,
        x: width * (1 / 4),
        y: (outputPath[2] as number) + visibleOutputHeight / 2,
    };

    // Definitions for cofee label:
    const coffeeHeight = (coffeePath[6] as number) - (coffeePath[2] as number);
    const coffeeLabelPosition = {
        dx: -10,
        x: width * (1 / 4),
        y: (coffeePath[2] as number) + coffeeHeight / 2,
    };
    const coffeeValue = round((ratio / 1000) * output);

    // Returns a new output value given a position:
    const _positionToOutput = useCallback(
        (posY: number) => {
            const lowestYValue = outputRange[1]; // Corresponds with highest physical position!
            const highestYValue = outputRange[0]; // Corresponds with lowset physical position!
            const posWithinRange = withinRange(
                posY,
                lowestYValue,
                highestYValue,
            );
            const percentage =
                1 -
                rangeProgressFromValue(
                    posWithinRange,
                    lowestYValue,
                    highestYValue,
                );
            const value = rangeValueFromProgress(
                percentage,
                minOutput,
                maxOutput,
            );
            return toStepSize(value, OUTPUT_STEP);
        },
        [outputRange, maxOutput, minOutput],
    );

    // Returns a new ratio value given a position:
    const _positionToRatio = useCallback(
        (posY: number) => {
            const lowestYValue = coffeeRange[1]; // Corresponds with highest physical position!
            const highestYValue = coffeeRange[0]; // Corresponds with lowset physical position!
            const posWithinRange = withinRange(
                posY,
                lowestYValue,
                highestYValue,
            );
            const percentage =
                1 -
                rangeProgressFromValue(
                    posWithinRange,
                    lowestYValue,
                    highestYValue,
                );
            const value = rangeValueFromProgress(
                percentage,
                minRatio,
                maxRatio,
            );
            return toStepSize(value, COFFEE_STEP);
        },
        [coffeeRange, maxRatio, minRatio],
    );

    // Is called whenever the user drags:
    const _onChange = useCallback(
        (posY: number, side: 'left' | 'right') => {
            if (side === 'right') {
                // We're dragging right, update the output:
                return setOutput(_positionToOutput(posY));
            } else {
                // We're dragging left, update the ratio:
                return setRatio(_positionToRatio(posY));
            }
        },
        [_positionToOutput, _positionToRatio],
    );

    // Callback to update external values:
    const onChange = useCallback(() => {
        onCommit?.(output, ratio);
    }, [onCommit, ratio, output]);

    // Handle dragging start:
    const onMouseDown = useCallback(
        (e: SliderPointerEvent) => {
            e.stopPropagation();
            const { x, y } = getPosition(e);

            // Update state to reflect dragging state (prefer dragging right):
            const side = x >= width / 2 ? 'right' : 'left';
            setSide(side);

            _onChange(y, side);
        },
        [getPosition, _onChange, width],
    );

    // Handle dragging:
    const onMouseMove = useCallback(
        (e: SliderPointerEvent) => {
            e.stopPropagation();

            // Don't do anything if we're not dragging:
            if (side === '') return;

            const { y } = getPosition(e);
            _onChange(y, side);
        },
        [getPosition, _onChange, side],
    );

    // Handle dragging end:
    const onMouseUp = useCallback(
        (e: SliderPointerEvent) => {
            e.stopPropagation();

            // Update the state to reflect that we're no longer dragging:
            setSide('');

            // Update external values:
            onChange();
        },
        [onChange],
    );

    return (
        <svg
            className={className}
            height={height}
            width="100%"
            viewBox={`0 0 ${width} ${height}`}
            ref={svgRef}
            onMouseDown={onMouseDown}
            onTouchStart={onMouseDown}
            onMouseMove={onMouseMove}
            onTouchMove={onMouseMove}
            onMouseUp={onMouseUp}
            onTouchEnd={onMouseUp}
        >
            <defs>
                <clipPath id="clipPath">
                    <path d={clipPathPath} />
                </clipPath>
            </defs>
            <g clipPath="url(#clipPath)" name="shape">
                <path
                    className="fill-current text-black/20"
                    d={backgroundPath.join(' ')}
                    name="bg"
                />
                <path
                    className="fill-current text-white"
                    d={outputPath.join(' ')}
                    name="output"
                />
                <path
                    className="fill-current text-coffee"
                    d={coffeePath.join(' ')}
                    name="coffee"
                />
            </g>
            <text
                fill="currentColor"
                name="output-label"
                textAnchor="end"
                {...outputLabelPosition}
            >
                <tspan className="text-sm capitalize">Output</tspan>
                <tspan
                    className="font-bold text-lg"
                    {...outputLabelPosition}
                    dy="23"
                >
                    {output}&nbsp;ml
                </tspan>
            </text>
            <text
                fill="currentColor"
                name="coffee-label"
                textAnchor="end"
                {...coffeeLabelPosition}
            >
                <tspan className="text-sm capitalize">Coffee</tspan>
                <tspan
                    className="font-bold text-lg"
                    {...coffeeLabelPosition}
                    dy="23"
                >
                    {coffeeValue}&nbsp;g
                </tspan>
            </text>
        </svg>
    );
};

const withinRange = (val: number, min: number, max: number) =>
    Math.min(Math.max(val, min), max);

const toStepSize = (val: number, stepSize: number) =>
    Math.ceil(val / stepSize) * stepSize;

const rangeProgressFromValue = (val: number, min: number, max: number) => {
    if (min === max) return 1;
    return withinRange((val - min) / (max - min), 0, 1);
};

const rangeValueFromProgress = (progress: number, min: number, max: number) =>
    min + progress * (max - min);

export default RatioSlider;
