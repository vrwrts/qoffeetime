import classNames from 'classnames';
import type { PropsWithChildren } from 'react';

type NavLayoutProps = PropsWithChildren<{
    className?: string;
}>;

const NavLayout = ({ children, ...props }: NavLayoutProps) => {
    const className = classNames(
        'flex flex-row items-center px-2',
        props.className,
    );

    return (
        <nav className={className} style={{ gridArea: 'nav' }}>
            {children}
        </nav>
    );
};

export default NavLayout;
