import FooterLayout from '../layouts/FooterLayout';
import MainLayout from '../layouts/MainLayout';

import Button from './Button';
import Portal from './Portal';

type RatioSliderHintProps = {
    height: number;
    isOpen: boolean;
    onDismiss?: () => void;
};

const RatioSliderHint = ({
    height,
    isOpen,
    onDismiss,
}: RatioSliderHintProps) => {
    // Construct the hint shape:
    const hintDividerPath = [
        'M',
        5,
        height * (1 / 16),
        'V',
        height * (15 / 16),
    ];

    return (
        <Portal isOpen={isOpen}>
            <div className="app fixed inset-0 bg-black bg-opacity-75 z-10">
                <MainLayout>
                    <h1 className="text-5xl font-bold">How to use</h1>
                    <section
                        className="flex flex-row justify-center"
                        style={{
                            height,
                        }}
                    >
                        <p className="flex-1 mx-3 my-14 self-start">
                            Change how much ground coffee you'll use (thus
                            changing the <strong>ratio</strong> of your brew) by
                            swiping on the left.
                        </p>
                        <svg
                            height={height}
                            viewBox={`0 0 10 ${height}`}
                            width={10}
                        >
                            <path
                                d={hintDividerPath.join(' ')}
                                stroke="white"
                                strokeWidth={3}
                                strokeDasharray={height / 20}
                            />
                        </svg>
                        <p className="flex-1 mx-3 my-14 self-end">
                            Specify how much coffee you'll brew in total (
                            <strong>output</strong>) by swiping on the right.
                        </p>
                    </section>
                </MainLayout>
                <FooterLayout>
                    <Button onClick={onDismiss}>Dismiss</Button>
                </FooterLayout>
            </div>
        </Portal>
    );
};

export default RatioSliderHint;
