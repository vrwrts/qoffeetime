import { useEffect } from 'react';

/** Sets `document.title` while the calling component is mounted. */
export const useDocumentTitle = (title: string) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};
