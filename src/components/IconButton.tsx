import Icon from '@mdi/react';
import classNames from 'classnames';
import type { HTMLProps } from 'react';
import { forwardRef } from 'react';

type IconButtonProps = HTMLProps<HTMLAnchorElement> &
    HTMLProps<HTMLButtonElement> & {
        href?: string;
        icon: string;
        small?: boolean;
        type?: 'button' | 'submit' | 'reset';
    };

const IconButton = forwardRef<
    HTMLAnchorElement & HTMLButtonElement,
    IconButtonProps
>(({ icon, small, ...props }, ref) => {
    const Tag = props.href ? 'a' : 'button';

    return (
        <Tag
            {...props}
            className={classNames(
                'rounded-full text-white items-center justify-center bg-black bg-opacity-40',
                { 'p-1': !!small, 'p-2': !small },
            )}
            ref={ref}
        >
            <Icon path={icon} size={small ? '20px' : 1} />
        </Tag>
    );
});

export default IconButton;
