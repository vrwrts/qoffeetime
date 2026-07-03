import type { PropsWithChildren } from 'react';

const Footer = ({ children }: PropsWithChildren) => (
    <footer className="px-4 py-6" style={{ gridArea: 'footer' }}>
        {children}
    </footer>
);

export default Footer;
