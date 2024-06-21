import { User } from 'document-model/document';
import { createContext } from 'react';
import { ArbitrumLtipGranteeState } from '../../../document-models/arbitrum-ltip-grantee';

export enum Role {
    Root = 'root',
    Editor = 'editor',
    Viewer = 'viewer',
}

type UserContextType = {
    user: User | undefined;
    state: ArbitrumLtipGranteeState | undefined;
};

export const UserContext = createContext<UserContextType>({
    user: undefined,
    state: undefined,
});

type UserProviderProps = {
    user: User | undefined;
    state: ArbitrumLtipGranteeState | undefined;
    children: React.ReactNode;
};

export const UserProvider = ({ user, state, children }: UserProviderProps) => {
    return (
        <UserContext.Provider value={{ user, state }}>
            {children}
        </UserContext.Provider>
    );
};
