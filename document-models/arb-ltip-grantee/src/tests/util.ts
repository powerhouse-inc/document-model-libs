import { toArray } from '../../../../editors/arb-ltip/util';
import { ArbLtipGranteeDocument, ArbLtipGranteeState } from '../../gen';

export const signer = '0x50379DDB64b77e990Bc4A433c9337618C70D2C2a';

export const createContext = (addr: string = signer) => ({
    signer: {
        user: {
            address: addr,
            chainId: 1,
            networkId: '',
        },
        app: {
            key: '',
            name: '',
        },
        signature: '',
    },
});

export const isEditorRole = (
    state: ArbLtipGranteeState,
    signer: string | undefined,
) => {
    if (!signer) {
        return false;
    }

    for (const editor of toArray(state.editorAddresses)) {
        if (editor === signer) {
            return true;
        }
    }

    return state.authorizedSignerAddress === signer;
};

export const isAdminRole = (
    state: ArbLtipGranteeState,
    signer: string | undefined,
) => {
    if (!signer) {
        return false;
    }

    return state.authorizedSignerAddress === signer;
};

export const expectNoException = (document: ArbLtipGranteeDocument) => {
    const lastOp =
        document.operations.global[document.operations.global.length - 1];
    expect(lastOp.error).toBeUndefined();
};

export const expectException = (
    document: ArbLtipGranteeDocument,
    message: string,
) => {
    const lastOp =
        document.operations.global[document.operations.global.length - 1];
    expect(lastOp.error).toBe(message);
};
