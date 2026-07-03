import type { PropsWithChildren } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = PropsWithChildren<{
    isOpen: boolean;
}>;

const Portal = ({ children, isOpen }: PortalProps) =>
    isOpen ? createPortal(children, document.body) : null;

export default Portal;
