import classNames from 'clsx';
import type { PropsWithChildren } from 'react';

type FullHeightLayoutProps = PropsWithChildren<{
    align?: 'bottom' | 'top' | 'full';
    className?: string;
}>;

const getGridRow = (align: FullHeightLayoutProps['align']) => {
    switch (align) {
        case 'bottom':
            return 'main / footer';
        case 'full':
            return 'nav / footer';
        default:
            return 'nav / main';
    }
};

const FullHeightLayout = ({
    align = 'top',
    children,
    ...props
}: FullHeightLayoutProps) => {
    const className = classNames(
        'overflow-hidden flex flex-col',
        props.className,
    );
    const gridRow = getGridRow(align);

    return (
        <main className={className} style={{ gridRow }}>
            {children}
        </main>
    );
};

export default FullHeightLayout;
