type TimerStatProps = {
    as?: string;
    label: string;
    value: string;
};

const TimerStat = ({ as = 'span', label, value }: TimerStatProps) => {
    const Tag = as;

    return (
        <div className="text-center">
            {/* @ts-expect-error */}
            <Tag className="block text-3xl font-bold">{value}</Tag>
            <span className="block">{label}</span>
        </div>
    );
};

export default TimerStat;
