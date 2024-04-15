import { User } from 'document-model/document';
import { createContext, useContext, useMemo, useState } from 'react';
import { ArbLtipGranteeState } from '../../../document-models/arb-ltip-grantee';

export enum Role {
    Root = 'root',
    Editor = 'editor',
    Viewer = 'viewer',
}

type UserContextType = {
    user: User | undefined;
    state: ArbLtipGranteeState | undefined;
};

const UserContext = createContext<UserContextType>({
    user: undefined,
    state: undefined,
});

type UserProviderProps = {
    user: User | undefined;
    state: ArbLtipGranteeState | undefined;
    children: React.ReactNode;
};

export const UserProvider = ({ user, state, children }: UserProviderProps) => {
    return (
        <UserContext.Provider value={{ user, state }}>
            {children}
        </UserContext.Provider>
    );
};

const useRole = (): Role => {
    const context = useContext(UserContext);
    return useMemo(() => {
        const { user, state } = context;
        if (user?.address === state?.authorizedSignerAddress) {
            return Role.Root;
        }

        // todo: check editors

        return Role.Viewer;
    }, [context]);
};

export const useIsEditor = () => {
    const role = useRole();
    return role === Role.Root || role === Role.Editor;
};

export const useIsAdmin = () => useRole() === Role.Root;
