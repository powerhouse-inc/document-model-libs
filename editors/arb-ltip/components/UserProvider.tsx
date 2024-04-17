import { User } from 'document-model/document';
import { createContext, useContext, useMemo, useState } from 'react';
import { ArbLtipGranteeState } from '../../../document-models/arb-ltip-grantee';
import { toArray } from '../util';

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

export const useAddress = () => {
    const context = useContext(UserContext);
    return context.user?.address;
};

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

export const useIsEditor = () => {
    const role = useRole();
    return role === Role.Root || role === Role.Editor;
};

export const useIsAdmin = () => useRole() === Role.Root;
