/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import {
    makeEmptyGroupTransactionByType,
    makeFixedIncomeAssetWithDerivedFields,
    validateCashTransaction,
    validateFeeTransaction,
    validateFeeTransactions,
    validateFixedIncomeTransaction,
    validateInterestTransaction,
} from '../..';
import { RealWorldAssetsTransactionsOperations } from '../../gen/transactions/operations';
import {
    FEE_TRANSACTIONS,
    PRINCIPAL_DRAW,
    groupTransactionTypesToAllowedTransactions,
} from '../constants';

export const reducer: RealWorldAssetsTransactionsOperations = {
    createGroupTransactionOperation(state, action, dispatch) {
        const id = action.input.id;

        if (!id) {
            throw new Error('Group transaction must have an id');
        }

        const type = PRINCIPAL_DRAW;

        const entryTime = action.input.entryTime;

        let cashTransaction = action.input.cashTransaction ?? null;
        let fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;
        let interestTransaction = action.input.interestTransaction ?? null;
        let feeTransactions = action.input.feeTransactions
            ? action.input.feeTransactions.map(ft => ft ?? null).filter(Boolean)
            : null;

        if (cashTransaction) {
            cashTransaction = {
                ...cashTransaction,
                entryTime,
            };
            validateCashTransaction(state, cashTransaction);
        }

        if (fixedIncomeTransaction) {
            fixedIncomeTransaction = {
                ...fixedIncomeTransaction,
                entryTime,
            };
            validateFixedIncomeTransaction(state, fixedIncomeTransaction);
        }

        if (interestTransaction) {
            interestTransaction = {
                ...interestTransaction,
                entryTime,
            };
            validateInterestTransaction(state, interestTransaction);
        }

        if (feeTransactions) {
            feeTransactions = feeTransactions.map(ft => ({
                ...ft,
                entryTime,
            }));
            validateFeeTransactions(state, feeTransactions);
        }

        const newGroupTransaction = {
            id,
            type,
            entryTime,
            cashTransaction,
            feeTransactions,
            fixedIncomeTransaction,
            interestTransaction,
        };

        state.transactions.push(newGroupTransaction);

        const assetId = fixedIncomeTransaction?.assetId;

        if (!assetId) return;

        const newAsset = makeFixedIncomeAssetWithDerivedFields(state, assetId);

        state.portfolio = state.portfolio.map(a =>
            a.id === assetId ? newAsset : a,
        );
    },
    editGroupTransactionTypeOperation(state, action, dispatch) {
        const id = action.input.id;

        if (!id) {
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
            action.input.entryTime,
        );

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id ? newGroupTransaction : t,
        );
    },
    editGroupTransactionOperation(state, action, dispatch) {
        const id = action.input.id;

        if (!id) {
            throw new Error('Group transaction must have an id');
        }

        const type = PRINCIPAL_DRAW;

        const transaction = state.transactions.find(
            transaction => transaction.id === action.input.id,
        );

        if (!transaction) {
            throw new Error(
                `Group transaction with id ${action.input.id} does not exist!`,
            );
        }

        const entryTime = action.input.entryTime ?? transaction.entryTime;

        const cashTransaction = action.input.cashTransaction ?? null;
        const fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;
        const interestTransaction = action.input.interestTransaction ?? null;
        const feeTransactions = action.input.feeTransactions
            ? action.input.feeTransactions.map(ft => ft ?? null).filter(Boolean)
            : null;

        if (cashTransaction) {
            cashTransaction.entryTime = entryTime;
            validateCashTransaction(state, cashTransaction);
        }

        if (fixedIncomeTransaction) {
            fixedIncomeTransaction.entryTime = entryTime;
            validateFixedIncomeTransaction(state, fixedIncomeTransaction);
        }

        if (interestTransaction) {
            interestTransaction.entryTime = entryTime;
            validateInterestTransaction(state, interestTransaction);
        }

        if (feeTransactions) {
            feeTransactions.forEach(ft => {
                ft.entryTime = entryTime;
            });
            validateFeeTransactions(state, feeTransactions);
        }

        const newGroupTransaction = {
            id,
            type,
            entryTime,
            cashTransaction,
            feeTransactions,
            interestTransaction,
            fixedIncomeTransaction,
        };
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id ? newGroupTransaction : t,
        );
    },
    addFeeTransactionsToGroupTransactionOperation(state, action) {
        const id = action.input.id;

        if (!id) {
            throw new Error('Group transaction must have an id');
        }

        const transaction = state.transactions.find(
            transaction => transaction.id === id,
        );

        if (!transaction) {
            throw new Error(`Group transaction with id ${id} does not exist!`);
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

        if (!feeTransactions) return;

        validateFeeTransactions(state, feeTransactions);

        const newFeeTransactions = [
            ...feeTransactions,
            ...(transaction.feeTransactions || []),
        ];

        const newGroupTransaction = {
            ...transaction,
            feeTransactions: newFeeTransactions,
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id ? newGroupTransaction : t,
        );
    },
    editFeeTransactionOperation(state, action, dispatch) {
        const id = action.input.id;
        const feeTransactionId = action.input.feeTransactionId;

        if (!id) {
            throw new Error('Group transaction must have an id');
        }

        if (!feeTransactionId) {
            throw new Error('Fee transaction must have an id');
        }

        const groupTransaction = state.transactions.find(
            transaction => transaction.id === id,
        );

        if (!groupTransaction) {
            throw new Error(`Group transaction with id ${id} does not exist!`);
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

        if (!groupTransaction.feeTransactions) {
            throw new Error(
                `Group transaction with id ${id} does not have fee transactions`,
            );
        }

        const feeTransaction = groupTransaction.feeTransactions.find(
            f => f?.id === feeTransactionId,
        );

        if (!feeTransaction) {
            throw new Error(
                `Fee transaction with id ${feeTransactionId} does not exist!`,
            );
        }

        const newFeeTransaction = {
            ...feeTransaction,
            ...action.input,
        };

        validateFeeTransaction(state, newFeeTransaction);

        const newFeeTransactions = groupTransaction.feeTransactions.map(f =>
            f?.id === feeTransactionId ? newFeeTransaction : f,
        );

        const newGroupTransaction = {
            ...groupTransaction,
            feeTransactions: newFeeTransactions,
        };

        state.transactions = state.transactions.map(t =>
            t.id === action.input.id ? newGroupTransaction : t,
        );
    },
    removeFeeTransactionFromGroupTransactionOperation(state, action) {
        const { id, feeTransactionId } = action.input;

        if (!id) {
            throw new Error('Group transaction must have an id');
        }

        if (!feeTransactionId) {
            throw new Error('Fee transaction must have an id');
        }

        const groupTransaction = state.transactions.find(
            transaction => transaction.id === id,
        );

        if (!groupTransaction) {
            throw new Error(`Group transaction with id ${id} does not exist!`);
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

        if (!groupTransaction.feeTransactions) {
            throw new Error(
                `Group transaction with id ${id} does not have fee transactions`,
            );
        }

        const feeTransaction = groupTransaction.feeTransactions.find(
            f => f?.id === feeTransactionId,
        );

        if (!feeTransaction) {
            throw new Error(
                `Fee transaction with id ${feeTransactionId} does not exist!`,
            );
        }

        const newFeeTransactions = groupTransaction.feeTransactions.filter(
            f => f?.id !== feeTransactionId,
        );

        const newGroupTransaction = {
            ...groupTransaction,
            feeTransactions: newFeeTransactions,
        };

        state.transactions = state.transactions.map(t =>
            t.id === id ? newGroupTransaction : t,
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
