import { useMemo } from 'react';
import { ArbLtipGranteeState } from '../../../document-models/arb-ltip-grantee';

export enum Role {
    Root = 'root',
    Editor = 'editor',
    Viewer = 'viewer',
}

const useRole = (state: ArbLtipGranteeState): Role =>
    useMemo(() => {
        // TODO

        return Role.Root;
    }, [state]);

export default useRole;
