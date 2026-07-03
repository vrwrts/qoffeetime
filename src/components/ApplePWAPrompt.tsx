import { useLocalStorage } from '../lib/useLocalStorage';
import Portal from './Portal';

const AppleAddIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        viewBox="55.99425507 31.98999977 157.76574707 157.76371765"
    >
        <path
            fill="currentColor"
            d="M90.49 32.83a54.6 54.6 0 019.55-.84c23.98.03 47.96 0 71.94.01 8.5.07 17.3 1.74 24.4 6.65 10.94 7.28 16.52 20.54 17.35 33.3.06 26.03 0 52.06.03 78.08 0 10.16-3.59 20.56-10.95 27.73-7.93 7.61-18.94 11.43-29.79 11.98-25.71.03-51.42 0-77.12.01-10.37-.11-21.01-3.77-28.17-11.48-8.22-8.9-11.72-21.29-11.73-33.21.01-23.03-.03-46.05.02-69.07-.01-9.14 1.33-18.71 6.65-26.4 6.21-9.4 16.97-14.79 27.82-16.76m38.18 41.09c-.05 10.25.01 20.5 0 30.75-9.58-.03-19.16.02-28.75-.04-2.27.08-4.98-.25-6.68 1.61-2.84 2.34-2.75 7.12.01 9.48 1.8 1.69 4.46 1.57 6.75 1.64 9.56-.04 19.12-.01 28.67-.03.02 10.24-.06 20.48.01 30.72-.14 2.66 1.36 5.4 3.95 6.3 3.66 1.66 8.52-1.13 8.61-5.23.26-10.59.02-21.2.09-31.79 9.88 0 19.76.02 29.64.01 2.74.12 5.85-.67 7.14-3.34 2.23-3.75-.61-9.34-5.08-9.29-10.57-.14-21.14-.01-31.7-.04-.01-10.25.04-20.49 0-30.74.3-3.5-2.66-7.09-6.3-6.79-3.65-.33-6.66 3.26-6.36 6.78z"
        />
        <path
            fill="transparent"
            d="M128.67 73.92c-.3-3.52 2.71-7.11 6.36-6.78 3.64-.3 6.6 3.29 6.3 6.79.04 10.25-.01 20.49 0 30.74 10.56.03 21.13-.1 31.7.04 4.47-.05 7.31 5.54 5.08 9.29-1.29 2.67-4.4 3.46-7.14 3.34-9.88.01-19.76-.01-29.64-.01-.07 10.59.17 21.2-.09 31.79-.09 4.1-4.95 6.89-8.61 5.23-2.59-.9-4.09-3.64-3.95-6.3-.07-10.24.01-20.48-.01-30.72-9.55.02-19.11-.01-28.67.03-2.29-.07-4.95.05-6.75-1.64-2.76-2.36-2.85-7.14-.01-9.48 1.7-1.86 4.41-1.53 6.68-1.61 9.59.06 19.17.01 28.75.04.01-10.25-.05-20.5 0-30.75z"
        />
    </svg>
);

const AppleShareIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 120 169">
        <g fill="currentColor">
            <path d="M60 0l28 28-2 2a586 586 0 0 0-4 4L64 15v90h-8V15L38 34l-4-4-2-2L60 0z" />
            <path d="M0 49h44v8H8v104h104V57H76v-8h44v120H0V49z" />
        </g>
    </svg>
);

const ApplePWAPrompt = () => {
    const [seenPrompt, setSeenPrompt] = useLocalStorage<boolean>(
        'seenApplePWAPrompt',
        false,
    );
    const isIOS =
        [
            'iPad Simulator',
            'iPhone Simulator',
            'iPod Simulator',
            'iPad',
            'iPhone',
            'iPod',
        ].includes(navigator.platform) ||
        (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
    const isInStandaloneMode =
        (window.navigator as Navigator & { standalone?: boolean })
            .standalone === true ||
        window.matchMedia('(display-mode: standalone)').matches;
    const onClose = () => setSeenPrompt(true);

    return (
        <Portal isOpen={!seenPrompt && !isInStandaloneMode && isIOS}>
            <aside className="fixed bottom-0 left-0 right-0 z-20 p-2">
                <div className=" rounded-lg dark:bg-black/60 dark:text-white bg-white/75 text-black bg-clip-padding backdrop-filter backdrop-blur-3xl">
                    <header className="flex justify-between px-4 py-2">
                        <h4 className="text-lg font-semibold">
                            Add to Home Screen
                        </h4>
                        <button
                            type="button"
                            className="text-blue-600"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </header>
                    <p className="p-4 border-t border-gray-200 text-gray-500 text-sm">
                        This website has app functionality. Add it to your
                        homescreen to get the best experience.
                    </p>
                    <ol className="p-4 border-t border-gray-200 text-gray-500">
                        <li className="flex items-center mb-4">
                            <AppleShareIcon className="text-blue-600 w-6 h-6 grow-0 shrink-0 mr-3" />
                            <span className="leading-5 text-sm">
                                Press the 'Share' button on the menu bar below.
                            </span>
                        </li>
                        <li className="flex items-center">
                            <AppleAddIcon className="text-gray-600 w-6 h-6 grow-0 shrink-0 mr-3" />
                            <span className="leading-5 text-sm">
                                Press 'Add to Home Screen'.
                            </span>
                        </li>
                    </ol>
                </div>
            </aside>
            <div className="fixed inset-0 bg-black/50 z-10" />
        </Portal>
    );
};

export default ApplePWAPrompt;
