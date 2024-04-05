import {
    computeFixedIncomeAssetDerivedFields,
    getGroupTransactionsForAsset,
    validateFixedIncomeAssetDerivedFields,
} from '.';
import { GroupTransactionType, RealWorldAssetsState } from '../..';
import {
    ASSET_PURCHASE,
    ASSET_SALE,
    FEES_PAYMENT,
    INTEREST_PAYMENT,
    PRINCIPAL_DRAW,
    PRINCIPAL_RETURN,
} from '../constants';

export function makeFixedIncomeAssetWithDerivedFields(
    state: RealWorldAssetsState,
    assetId: string,
) {
    const asset = state.portfolio.find(a => a.id === assetId);
    if (!asset) {
        throw new Error(`Asset with id ${assetId} does not exist!`);
    }

    const transactions = getGroupTransactionsForAsset(state, assetId);

    const derivedFields = computeFixedIncomeAssetDerivedFields(transactions);

    validateFixedIncomeAssetDerivedFields(derivedFields);
    const newAsset = {
        ...asset,
        ...derivedFields,
    };

    return newAsset;
}

export function makeEmptyGroupTransactionByType(
    type: GroupTransactionType,
    id: string,
    entryTime: string = new Date().toISOString(),
) {
    const cashBalanceChange = 0;
    const fees = null;
    const cashTransaction = null;
    const fixedIncomeTransaction = null;
    const base = {
        type,
        id,
        entryTime,
        cashBalanceChange,
    };
    switch (type) {
        case PRINCIPAL_DRAW:
        case PRINCIPAL_RETURN: {
            return {
                ...base,
                cashTransaction,
                fees,
            };
        }
        case ASSET_PURCHASE:
        case ASSET_SALE: {
            return {
                ...base,
                fees,
                cashTransaction,
                fixedIncomeTransaction,
            };
        }
        case INTEREST_PAYMENT: {
            return {
                ...base,
                fees,
                cashTransaction: null,
            };
        }
        case FEES_PAYMENT: {
            return {
                ...base,
                cashTransaction: null,
            };
        }
    }
}
