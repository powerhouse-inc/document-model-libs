import { toArray } from '../../../editors/arb-ltip/util';
import {
    ArbitrumLtipGranteeDocument,
    ArbitrumLtipGranteeState,
    Contract,
    GranteeActuals,
    Maybe,
} from '../gen';

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
    state: ArbitrumLtipGranteeState,
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
    state: ArbitrumLtipGranteeState,
    signer: string | undefined,
) => {
    if (!signer) {
        return false;
    }

    return state.authorizedSignerAddress === signer;
};

export const expectNoException = (document: ArbitrumLtipGranteeDocument) => {
    const lastOp =
        document.operations.global[document.operations.global.length - 1];
    expect(lastOp.error).toBeUndefined();
};

export const expectException = (
    document: ArbitrumLtipGranteeDocument,
    message: string,
) => {
    const lastOp =
        document.operations.global[document.operations.global.length - 1];
    expect(lastOp.error).toBe(message);
};

export const fromCommaDelimitedString = (str: string) =>
    (str || '').split(',').map(v => v.trim());
export const toCommaDelimitedString = (arr: string[]) => (arr || []).join(', ');

const containsContract = (contracts: Contract[], addr: Maybe<string>) =>
    contracts.some(c => c.contractAddress === addr);

const addDistinct = (all: Contract[], contracts: Maybe<Contract>[]) =>
    contracts
        .map(c => c!)
        .filter(c => !containsContract(all, c.contractAddress))
        .forEach(contract => all.push(contract));

export const findAllContracts = (state: ArbitrumLtipGranteeState) => {
    const all: Contract[] = [];

    // add funding address
    all.push({
        contractAddress: state.fundingAddress!,
        contractId: 'Funding Address',
        contractLabel: 'Funding Address',
    });

    // add all contracts from all phases
    for (const phase of toArray(state.phases)) {
        addDistinct(all, phase.planned?.contractsIncentivized || []);
        addDistinct(all, phase.actuals?.contractsIncentivized || []);
    }

    return all;
};

// since we require summary to be filled in, this is enough to guarantee we haven't already submitted.
// however, we leave this function in case someone changes this requirement in the future.
export const isActualsEmpty = (actuals: Maybe<GranteeActuals>) =>
    actuals?.summary === '';
