/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { noCase } from 'change-case';
import { InputMaybe } from 'document-model/document-model';
import { z } from 'zod';
import {
    FeesPaymentGroupTransaction,
    RealWorldAssetsState,
    Asset,
    BaseTransaction,
    Cash,
    FixedIncome,
    GroupTransaction,
    GroupTransactionType,
} from '../..';
import { RealWorldAssetsTransactionsOperations } from '../../gen/transactions/operations';
import {
    AssetPurchase,
    AssetSale,
    FeesPayment,
    InterestDraw,
    InterestReturn,
    PrincipalDraw,
    PrincipalReturn,
    allPossibleAllowedTransactions,
    groupTransactionTypesToAllowedTransactions,
} from '../constants';

const numberValidator = z.number();

const dateValidator = z.coerce.date();

export function validateHasCorrectTransactions(
    groupTransactionType: GroupTransactionType,
    transactionsInput: {
        cashTransaction?: InputMaybe<BaseTransaction>;
        fixedIncomeTransaction?: InputMaybe<BaseTransaction>;
        interestTransaction?: InputMaybe<BaseTransaction>;
        feeTransactions?: InputMaybe<InputMaybe<BaseTransaction>[]>;
    },
) {
    const allowedTransaction =
        groupTransactionTypesToAllowedTransactions[groupTransactionType];
    const notAllowedTransactions = allPossibleAllowedTransactions.filter(
        tx => tx !== allowedTransaction,
    );
    notAllowedTransactions.forEach(tx => {
        if (transactionsInput[tx]) {
            throw new Error(
                `Group transaction of type ${groupTransactionType} cannot have a ${noCase(tx)} transaction`,
            );
        }
    });
}

export function isFixedIncomeAsset(
    asset: Asset | undefined,
): asset is FixedIncome {
    if (!asset) return false;
    return 'type' in asset;
}

export function isCashAsset(asset: Asset | undefined): asset is Cash {
    if (!asset) return false;
    return 'spv' in asset;
}

export function validateBaseTransaction(
    state: RealWorldAssetsState,
    input: InputMaybe<BaseTransaction>,
) {
    if (!input?.id) {
        throw new Error(`Transaction must have an id`);
    }
    if (state.transactions.find(transaction => transaction.id === input.id)) {
        throw new Error(`Transaction with id ${input.id} already exists!`);
    }
    if (!input.asset) {
        throw new Error(`Transaction must have an asset`);
    }
    if (!state.portfolio.find(asset => asset.id === input.asset)) {
        throw new Error(`Asset with id ${input.asset} does not exist!`);
    }
    if (!input.amount) {
        throw new Error(`Transaction must have an amount`);
    }
    if (!input.entryTime) {
        throw new Error(`Transaction must have an entry time`);
    }

    if (!dateValidator.safeParse(input.entryTime).success) {
        throw new Error(`Entry time must be a valid date`);
    }
    if (input.tradeTime && !dateValidator.safeParse(input.tradeTime).success) {
        throw new Error(`Trade time must be a valid date`);
    }
    if (
        input.settlementTime &&
        !dateValidator.safeParse(input.settlementTime).success
    ) {
        throw new Error(`Settlement time must be a valid date`);
    }
    if (input.account && !state.accounts.find(a => a.id === input.account)) {
        throw new Error(`Account with id ${input.account} does not exist!`);
    }
    if (
        input.counterParty &&
        !state.accounts.find(a => a.id === input.counterParty)
    ) {
        throw new Error(
            `Counter party account with id ${input.counterParty} does not exist!`,
        );
    }
}

export function validateFixedIncomeTransaction(
    state: RealWorldAssetsState,
    transaction: BaseTransaction,
) {
    if (
        !isFixedIncomeAsset(
            state.portfolio.find(a => a.id === transaction.asset),
        )
    ) {
        throw new Error(
            `Fixed income transaction must have a fixed income asset as the asset`,
        );
    }
}

export function validateCashTransaction(
    state: RealWorldAssetsState,
    transaction: BaseTransaction,
) {
    if (transaction === null) return;
    if (transaction.counterParty !== state.principalLender) {
        throw new Error(
            `Cash transaction must have Maker principal lender as the counter party`,
        );
    }
    if (!isCashAsset(state.portfolio.find(a => a.id === transaction.asset))) {
        throw new Error(`Cash transaction must have a cash asset as the asset`);
    }
}

export function validateInterestTransaction(
    state: RealWorldAssetsState,
    transaction: BaseTransaction,
) {
    if (
        !isFixedIncomeAsset(
            state.portfolio.find(a => a.id === transaction.asset),
        )
    ) {
        throw new Error(
            `Interest transaction must have a fixed income asset as the asset`,
        );
    }
    if (!transaction.counterParty) {
        throw new Error(
            `Interest transaction must have a counter party account`,
        );
    }
    if (!state.feeTypes.find(a => a.accountId === transaction.counterParty)) {
        throw new Error(
            `Counter party with id ${transaction.counterParty} must be a known service provider`,
        );
    }
    if (!numberValidator.positive().safeParse(transaction.amount).success) {
        throw new Error('Interest transaction amount must be positive');
    }
}

export function validateFeeTransaction(
    state: RealWorldAssetsState,
    transaction: BaseTransaction,
) {
    if (!isCashAsset(state.portfolio.find(a => a.id === transaction.asset))) {
        throw new Error(`Fee transaction must have a cash asset as the asset`);
    }
    if (!transaction.counterParty) {
        throw new Error(`Fee transaction must have a counter party account`);
    }
    if (!state.feeTypes.find(a => a.accountId === transaction.counterParty)) {
        throw new Error(
            `Counter party with id ${transaction.counterParty} must be a known service provider`,
        );
    }
    if (!numberValidator.negative().safeParse(transaction.amount).success) {
        throw new Error('Fee transaction amount must be negative');
    }
}

export const reducer: RealWorldAssetsTransactionsOperations = {
    createPrincipalDrawGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = PrincipalDraw;

        validateHasCorrectTransactions(type, action.input);

        const cashTransaction = action.input.cashTransaction ?? null;

        if (cashTransaction) {
            validateCashTransaction(state, cashTransaction);
            if (cashTransaction.amount < 0) {
                throw new Error(
                    'Principal draw cash transaction amount must be positive',
                );
            }
        }

        const newGroupTransaction = {
            ...action.input,
            cashTransaction,
            type,
        };
        state.transactions.push(newGroupTransaction);
    },
    createPrincipalReturnGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = PrincipalReturn;

        validateHasCorrectTransactions(type, action.input);

        const cashTransaction = action.input.cashTransaction ?? null;

        if (cashTransaction) {
            validateCashTransaction(state, cashTransaction);
            if (cashTransaction.amount > 0) {
                throw new Error(
                    'Principal return cash transaction amount must be negative',
                );
            }
        }
        const newGroupTransaction = {
            ...action.input,
            cashTransaction,
            type,
        };
        state.transactions.push(newGroupTransaction);
    },
    createAssetPurchaseGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = AssetPurchase;

        validateHasCorrectTransactions(type, action.input);

        const fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;

        if (fixedIncomeTransaction) {
            validateFixedIncomeTransaction(state, fixedIncomeTransaction);
        }

        const newGroupTransaction = {
            ...action.input,
            fixedIncomeTransaction,
            type,
        };

        state.transactions.push(newGroupTransaction);
    },
    createAssetSaleGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = AssetSale;

        const fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;

        validateHasCorrectTransactions(type, action.input);

        if (fixedIncomeTransaction) {
            validateFixedIncomeTransaction(state, fixedIncomeTransaction);
        }

        const newGroupTransaction = {
            ...action.input,
            fixedIncomeTransaction,
            type,
        };

        state.transactions.push(newGroupTransaction);
    },
    createInterestDrawGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = InterestDraw;

        validateHasCorrectTransactions(type, action.input);

        const interestTransaction = action.input.interestTransaction ?? null;

        if (interestTransaction) {
            validateInterestTransaction(state, interestTransaction);
        }

        const newGroupTransaction = {
            ...action.input,
            interestTransaction,
            type,
        };

        state.transactions.push(newGroupTransaction);
    },
    createInterestReturnGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = InterestReturn;

        validateHasCorrectTransactions(type, action.input);

        const interestTransaction = action.input.interestTransaction ?? null;

        if (interestTransaction) {
            validateInterestTransaction(state, interestTransaction);
        }

        const newGroupTransaction = {
            ...action.input,
            interestTransaction,
            type,
        };

        state.transactions.push(newGroupTransaction);
    },
    createFeesPaymentGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = FeesPayment;

        validateHasCorrectTransactions(type, action.input);

        const feeTransactions = action.input.feeTransactions
            ? action.input.feeTransactions.map(ft => ft ?? null).filter(Boolean)
            : null;

        if (feeTransactions?.length) {
            feeTransactions.forEach(feeTransaction => {
                validateFeeTransaction(state, feeTransaction);
            });
        }

        const newGroupTransaction = {
            ...action.input,
            feeTransactions,
            type,
        };

        state.transactions.push(newGroupTransaction);
    },
    editGroupTransactionTypeOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        const transaction = state.transactions.find(
            transaction => transaction.id === action.input.id,
        );
        if (!transaction) {
            throw new Error(
                `Group transaction with id ${action.input.id} does not exist!`,
            );
        }
        if (action.input.type === transaction.type) {
            return;
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? {
                      ...t,
                      type: action.input.type,
                      cashTransaction: null,
                      fixedIncomeTransaction: null,
                      interestTransaction: null,
                      feeTransactions: [],
                  }
                : t,
        );
    },
    editPrincipalDrawGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (action.input.cashTransaction) {
            validateCashTransaction(state, action.input.cashTransaction);
            if (action.input.cashTransaction.amount < 0) {
                throw new Error(
                    'Principal draw cash transaction amount must be positive',
                );
            }
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      cashTransaction: action.input.cashTransaction,
                  } as GroupTransaction)
                : t,
        );
    },
    editPrincipalReturnGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (action.input.cashTransaction) {
            validateCashTransaction(state, action.input.cashTransaction);
            if (action.input.cashTransaction.amount > 0) {
                throw new Error(
                    'Principal return cash transaction amount must be negative',
                );
            }
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      cashTransaction: action.input.cashTransaction,
                  } as GroupTransaction)
                : t,
        );
    },
    editAssetPurchaseGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (action.input.fixedIncomeTransaction) {
            validateFixedIncomeTransaction(
                state,
                action.input.fixedIncomeTransaction,
            );
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      fixedIncomeTransaction:
                          action.input.fixedIncomeTransaction,
                  } as GroupTransaction)
                : t,
        );
    },
    editAssetSaleGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (action.input.fixedIncomeTransaction) {
            validateFixedIncomeTransaction(
                state,
                action.input.fixedIncomeTransaction,
            );
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      fixedIncomeTransaction:
                          action.input.fixedIncomeTransaction,
                  } as GroupTransaction)
                : t,
        );
    },
    editInterestDrawGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (action.input.interestTransaction) {
            validateInterestTransaction(
                state,
                action.input.interestTransaction,
            );
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      interestTransaction: action.input.interestTransaction,
                  } as GroupTransaction)
                : t,
        );
    },
    editInterestReturnGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (action.input.interestTransaction) {
            validateInterestTransaction(
                state,
                action.input.interestTransaction,
            );
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      interestTransaction: action.input.interestTransaction,
                  } as GroupTransaction)
                : t,
        );
    },
    addFeeTransactionsToFeesPaymentGroupTransactionOperation(state, action) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (action.input.feeTransactions?.length) {
            action.input.feeTransactions.forEach(feeTransaction => {
                if (!feeTransaction) return;
                validateFeeTransaction(state, feeTransaction);
            });
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      feeTransactions: [
                          ...((t as FeesPaymentGroupTransaction)
                              .feeTransactions || []),
                          ...(action.input.feeTransactions || []),
                      ],
                  } as GroupTransaction)
                : t,
        );
    },
    editFeeTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (!action.input.feeTransactionId) {
            throw new Error('Fee transaction must have an id');
        }
        validateFeeTransaction(state, action.input as BaseTransaction);
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      feeTransactions: (
                          (t as FeesPaymentGroupTransaction).feeTransactions ||
                          []
                      ).map(f =>
                          f?.id === action.input.feeTransactionId
                              ? action.input
                              : f,
                      ),
                  } as GroupTransaction)
                : t,
        );
    },
    removeFeeTransactionFromFeesPaymentGroupTransactionOperation(
        state,
        action,
    ) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (!action.input.feeTransactionId) {
            throw new Error('Fee transaction must have an id');
        }
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      feeTransactions: (
                          (t as FeesPaymentGroupTransaction).feeTransactions ||
                          []
                      ).filter(f => f?.id !== action.input.feeTransactionId),
                  } as GroupTransaction)
                : t,
        );
    },
    deleteGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        state.transactions = state.transactions.filter(
            transaction => transaction.id !== action.input.id,
        );
    },
};
