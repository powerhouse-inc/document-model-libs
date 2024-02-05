/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import {
    BaseTransaction,
    FeesPaymentGroupTransaction,
    GroupTransaction,
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
    INTEREST_DRAW,
    INTEREST_RETURN,
    PRINCIPAL_DRAW,
    PRINCIPAL_RETURN,
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
    removeFeeTransactionFromGroupTransactionOperation(state, action) {
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
