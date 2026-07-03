import classNames from 'clsx';
import type { PropsWithChildren } from 'react';

type MainLayoutProps = PropsWithChildren<{
    className?: string;
}>;

const MainLayout = ({ children, ...props }: MainLayoutProps) => {
    const className = classNames(
        'flex flex-col px-6 overflow-auto',
        props.className,
    );

    return (
        <main className={className} style={{ gridArea: 'main' }}>
            {children}
        </main>
    );
};

export default MainLayout;
