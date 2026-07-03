import { mdiClose } from '@mdi/js';

import GoBack from './GoBack';
import IconButton from './IconButton';

type BackButtonProps = {
    confirm?: string;
};

const BackButton = ({ confirm }: BackButtonProps) => (
    <GoBack confirm={confirm}>
        <IconButton icon={mdiClose} small />
    </GoBack>
);

export default BackButton;
