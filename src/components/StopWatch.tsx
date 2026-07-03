import classNames from 'classnames';

type StopwatchProps = {
    children: string;
    className?: string;
};

const StopWatch = ({ children, ...props }: StopwatchProps) => {
    const className = classNames(
        'relative border border-white rounded-full w-8 h-8 text-xs flex items-center justify-center flex-none font-semibold',
        props.className,
    );

    return <time className={className}>{children}</time>;
};

export default StopWatch;
