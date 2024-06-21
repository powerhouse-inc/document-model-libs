import { useContext, useMemo } from 'react';
import { Role, UserContext } from '../components/UserProvider';
import { toArray } from '../util';

const useRole = (): Role => {
    const context = useContext(UserContext);
    return useMemo(() => {
        const { user, state } = context;
        if (user?.address === state?.authorizedSignerAddress) {
            return Role.Root;
        }

        for (const addr of toArray(state?.editorAddresses || [])) {
            if (user?.address === addr) {
                return Role.Editor;
            }
        }

        return Role.Viewer;
    }, [context]);
};

export default useRole;
