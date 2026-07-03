import {
    Children,
    cloneElement,
    type PropsWithChildren,
    type ReactElement,
} from 'react';

type GoBackProps = PropsWithChildren<{
    confirm?: string;
}>;

const GoBack = ({ children, confirm }: GoBackProps) => {
    const onClick = () => {
        if (confirm) {
            if (window.confirm(confirm)) window.history.back();
        } else {
            window.history.back();
        }
    };

    return cloneElement(
        Children.only(children) as ReactElement<{ onClick?: () => void }>,
        {
            onClick,
        },
    );
};

export default GoBack;
