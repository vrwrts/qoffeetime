type CurrentStepDetailsProps = {
    description: string;
    remaining: string;
};

const CurrentStepDetails = ({
    description,
    remaining,
}: CurrentStepDetailsProps) => (
    <div>
        <time className="text-7xl font-bold">{remaining}</time>
        <p className="text-2xl font-semibold mt-2">{description}</p>
    </div>
);

export default CurrentStepDetails;
