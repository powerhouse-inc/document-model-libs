/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import {
    makeEmptyGroupTransactionByType,
    validateCashTransaction,
    validateFeeTransaction,
    validateFixedIncomeTransaction,
    validateHasCorrectTransactions,
    validateInterestTransaction,
} from '../..';
import { RealWorldAssetsTransactionsOperations } from '../../gen/transactions/operations';
import {
    ASSET_PURCHASE,
    ASSET_SALE,
    FEES_PAYMENT,
    FEE_TRANSACTIONS,
    INTEREST_DRAW,
    INTEREST_RETURN,
    PRINCIPAL_DRAW,
    PRINCIPAL_RETURN,
    groupTransactionTypesToAllowedTransactions,
} from '../constants';

export const reducer: RealWorldAssetsTransactionsOperations = {
    createPrincipalDrawGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = PRINCIPAL_DRAW;

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
            cashTransaction,
            feeTransactions,
            type,
        };
        state.transactions.push(newGroupTransaction);
    },
    createPrincipalReturnGroupTransactionOperation(state, action, dispatch) {
        const id = action.input.id;

        if (!id) {
            throw new Error('Group transaction must have an id');
        }

        const type = PRINCIPAL_RETURN;

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

        const feeTransactions = action.input.feeTransactions
            ? action.input.feeTransactions.map(ft => ft ?? null).filter(Boolean)
            : null;

        if (feeTransactions?.length) {
            feeTransactions.forEach(feeTransaction => {
                validateFeeTransaction(state, feeTransaction);
            });
        }

        const newGroupTransaction = {
            id,
            cashTransaction,
            feeTransactions,
            type,
        };
        state.transactions.push(newGroupTransaction);
    },
    createAssetPurchaseGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = ASSET_PURCHASE;

        validateHasCorrectTransactions(type, action.input);

        const fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;

        if (fixedIncomeTransaction) {
            validateFixedIncomeTransaction(state, fixedIncomeTransaction);
        }

        const cashTransaction = action.input.cashTransaction ?? null;

        if (cashTransaction) {
            validateCashTransaction(state, cashTransaction);
        }

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
            fixedIncomeTransaction,
            cashTransaction,
            feeTransactions,
            type,
        };

        state.transactions.push(newGroupTransaction);
    },
    createAssetSaleGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = ASSET_SALE;

        const fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;

        validateHasCorrectTransactions(type, action.input);

        if (fixedIncomeTransaction) {
            validateFixedIncomeTransaction(state, fixedIncomeTransaction);
        }

        const cashTransaction = action.input.cashTransaction ?? null;

        if (cashTransaction) {
            validateCashTransaction(state, cashTransaction);
        }

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
            fixedIncomeTransaction,
            cashTransaction,
            feeTransactions,
            type,
        };

        state.transactions.push(newGroupTransaction);
    },
    createInterestDrawGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const type = INTEREST_DRAW;

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

        const type = INTEREST_RETURN;

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

        const type = FEES_PAYMENT;

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
        const newGroupTransaction = makeEmptyGroupTransactionByType(
            action.input.type,
            action.input.id,
        );
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id ? newGroupTransaction : t,
        );
    },
    editPrincipalDrawGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        const cashTransaction = action.input.cashTransaction ?? null;
        if (cashTransaction) {
            validateCashTransaction(state, cashTransaction);
            if (cashTransaction.amount < 0) {
                throw new Error(
                    'Principal draw cash transaction amount must be positive',
                );
            }
        }
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
            cashTransaction,
            feeTransactions,
        };
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? {
                      ...t,
                      ...newGroupTransaction,
                  }
                : t,
        );
    },
    editPrincipalReturnGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const cashTransaction = action.input.cashTransaction ?? null;

        if (cashTransaction) {
            validateCashTransaction(state, cashTransaction);
            if (cashTransaction.amount > 0) {
                throw new Error(
                    'Principal return cash transaction amount must be negative',
                );
            }
        }

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
            cashTransaction,
            feeTransactions,
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? {
                      ...t,
                      ...newGroupTransaction,
                  }
                : t,
        );
    },
    editAssetPurchaseGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        const fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;

        if (fixedIncomeTransaction) {
            validateFixedIncomeTransaction(state, fixedIncomeTransaction);
        }

        const cashTransaction = action.input.cashTransaction ?? null;

        if (cashTransaction) {
            validateCashTransaction(state, cashTransaction);
        }

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
            cashTransaction,
            feeTransactions,
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? {
                      ...t,
                      ...newGroupTransaction,
                  }
                : t,
        );
    },
    editAssetSaleGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        const fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;

        if (fixedIncomeTransaction) {
            validateFixedIncomeTransaction(state, fixedIncomeTransaction);
        }

        const cashTransaction = action.input.cashTransaction ?? null;

        if (cashTransaction) {
            validateCashTransaction(state, cashTransaction);
        }

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
            cashTransaction,
            feeTransactions,
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? {
                      ...t,
                      ...newGroupTransaction,
                  }
                : t,
        );
    },
    editInterestDrawGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        const interestTransaction = action.input.interestTransaction ?? null;

        if (interestTransaction) {
            validateInterestTransaction(state, interestTransaction);
        }

        const newGroupTransaction = {
            ...action.input,
            interestTransaction,
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? {
                      ...t,
                      ...newGroupTransaction,
                  }
                : t,
        );
    },
    editInterestReturnGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        const interestTransaction = action.input.interestTransaction ?? null;
        if (interestTransaction) {
            validateInterestTransaction(state, interestTransaction);
        }

        const newGroupTransaction = {
            ...action.input,
            interestTransaction,
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? {
                      ...t,
                      ...newGroupTransaction,
                  }
                : t,
        );
    },
    addFeeTransactionsToGroupTransactionOperation(state, action) {
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

        if (
            !groupTransactionTypesToAllowedTransactions[
                transaction.type
            ].includes(FEE_TRANSACTIONS) ||
            !('feeTransactions' in transaction)
        ) {
            throw new Error(
                `Group transaction of type ${transaction.type} cannot have fee transactions`,
            );
        }

        const feeTransactions = action.input.feeTransactions
            ? action.input.feeTransactions.map(ft => ft ?? null).filter(Boolean)
            : null;

        if (feeTransactions?.length) {
            feeTransactions.forEach(feeTransaction => {
                validateFeeTransaction(state, feeTransaction);
            });
        }

        const newGroupTransaction = {
            ...transaction,
            feeTransactions: [
                ...(transaction.feeTransactions || []),
                ...(feeTransactions || []),
            ],
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id ? newGroupTransaction : t,
        );
    },
    editFeeTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (!action.input.feeTransactionId) {
            throw new Error('Fee transaction must have an id');
        }

        const groupTransaction = state.transactions.find(
            transaction => transaction.id === action.input.id,
        );

        if (!groupTransaction) {
            throw new Error(
                `Group transaction with id ${action.input.id} does not exist!`,
            );
        }

        if (
            !groupTransactionTypesToAllowedTransactions[
                groupTransaction.type
            ].includes(FEE_TRANSACTIONS) ||
            !('feeTransactions' in groupTransaction)
        ) {
            throw new Error(
                `Group transaction of type ${groupTransaction.type} cannot have fee transactions`,
            );
        }

        const feeTransaction = groupTransaction.feeTransactions?.find(
            f => f?.id === action.input.feeTransactionId,
        );

        if (!feeTransaction) {
            throw new Error(
                `Fee transaction with id ${action.input.feeTransactionId} does not exist!`,
            );
        }

        const newFeeTransaction = {
            ...feeTransaction,
            ...action.input,
        };

        validateFeeTransaction(state, newFeeTransaction);

        const newGroupTransaction = {
            ...groupTransaction,
            feeTransactions: (groupTransaction.feeTransactions || []).map(f =>
                f?.id === action.input.feeTransactionId ? newFeeTransaction : f,
            ),
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id ? newGroupTransaction : t,
        );
    },
    removeFeeTransactionFromGroupTransactionOperation(state, action) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }

        if (!action.input.feeTransactionId) {
            throw new Error('Fee transaction must have an id');
        }

        const groupTransaction = state.transactions.find(
            transaction => transaction.id === action.input.id,
        );

        if (!groupTransaction) {
            throw new Error(
                `Group transaction with id ${action.input.id} does not exist!`,
            );
        }

        if (
            !groupTransactionTypesToAllowedTransactions[
                groupTransaction.type
            ].includes(FEE_TRANSACTIONS) ||
            !('feeTransactions' in groupTransaction)
        ) {
            throw new Error(
                `Group transaction of type ${groupTransaction.type} cannot have fee transactions`,
            );
        }

        const feeTransaction = groupTransaction.feeTransactions?.find(
            f => f?.id === action.input.feeTransactionId,
        );

        if (!feeTransaction) {
            throw new Error(
                `Fee transaction with id ${action.input.feeTransactionId} does not exist!`,
            );
        }

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? {
                      ...t,
                      feeTransactions: (
                          groupTransaction.feeTransactions || []
                      ).filter(f => f?.id !== action.input.feeTransactionId),
                  }
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
