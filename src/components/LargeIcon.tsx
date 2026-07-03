import { Icon } from '@mdi/react';
import classNames from 'clsx';
import type { HTMLProps } from 'react';

type LargeIconProps = HTMLProps<HTMLDivElement> & {
    icon: string;
};

const LargeIcon = ({ icon, ...props }: LargeIconProps) => {
    const className = classNames(
        'w-20 h-20 rounded-full bg-white/40 inline-flex items-center justify-center',
        props.className,
    );

    return (
        <div {...props} className={className}>
            <Icon path={icon} size={2} />
        </div>
    );
};

export default LargeIcon;
