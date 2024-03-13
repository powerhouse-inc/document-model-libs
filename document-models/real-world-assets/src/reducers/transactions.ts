/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import {
    Cash,
    makeFixedIncomeAssetWithDerivedFields,
    validateCashTransaction,
    validateFeeTransactions,
    validateFixedIncomeTransaction,
    validateInterestTransaction,
    validateTransactionFees,
} from '../..';
import { RealWorldAssetsTransactionsOperations } from '../../gen/transactions/operations';

export const reducer: RealWorldAssetsTransactionsOperations = {
    createGroupTransactionOperation(state, action, dispatch) {
        const id = action.input.id;

        if (!id) {
            throw new Error('Group transaction must have an id');
        }

        const type = action.input.type;
        const entryTime = action.input.entryTime;
        const fees = action.input.fees ?? null;
        const cashBalanceChange = action.input.cashBalanceChange;
        let cashTransaction = action.input.cashTransaction ?? null;
        let fixedIncomeTransaction =
            action.input.fixedIncomeTransaction ?? null;
        let interestTransaction = action.input.interestTransaction ?? null;
        let feeTransactions = action.input.feeTransactions
            ? action.input.feeTransactions
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

        if (fees) {
            validateTransactionFees(state, fees);
        }

        const newGroupTransaction = {
            id,
            type,
            entryTime,
            fees,
            cashBalanceChange,
            cashTransaction,
            feeTransactions,
            fixedIncomeTransaction,
            interestTransaction,
        };

        state.transactions.push(newGroupTransaction);

        const fixedIncomeAssetId = fixedIncomeTransaction?.assetId;

        if (!fixedIncomeAssetId) return;

        const updatedFixedIncomeAsset = makeFixedIncomeAssetWithDerivedFields(
            state,
            fixedIncomeAssetId,
        );

        state.portfolio = state.portfolio.map(a =>
            a.id === fixedIncomeAssetId ? updatedFixedIncomeAsset : a,
        );

        const cashAssetId = cashTransaction?.assetId;

        const cashAsset = state.portfolio.find(
            a => a.id === cashAssetId,
        ) as Cash;

        const updatedCashAsset = {
            ...cashAsset,
            balance: cashAsset.balance + cashBalanceChange,
        };

        state.portfolio = state.portfolio.map(a =>
            a.id === cashAssetId ? updatedCashAsset : a,
        );
    },
    editGroupTransactionOperation(state, action, dispatch) {
        console.log('edit reducer', state, action);
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

        if (action.input.type) {
            transaction.type = action.input.type;
        }

        if (action.input.entryTime) {
            transaction.entryTime = action.input.entryTime;
            transaction.cashTransaction!.entryTime = action.input.entryTime;
            transaction.fixedIncomeTransaction!.entryTime =
                action.input.entryTime;
        }

        if (action.input.fixedIncomeTransaction?.amount) {
            transaction.fixedIncomeTransaction!.amount =
                action.input.fixedIncomeTransaction.amount;
        }

        if (action.input.fixedIncomeTransaction?.assetId) {
            console.log('look im doing it');
            transaction.fixedIncomeTransaction!.assetId =
                action.input.fixedIncomeTransaction.assetId;
        }

        if (action.input.cashTransaction?.amount) {
            transaction.cashTransaction!.amount =
                action.input.cashTransaction.amount;
        }

        if (action.input.cashBalanceChange) {
            transaction.cashBalanceChange = action.input.cashBalanceChange;
        }

        const fixedIncomeAssetId = transaction.fixedIncomeTransaction!.assetId;

        const updatedFixedIncomeAsset = makeFixedIncomeAssetWithDerivedFields(
            state,
            fixedIncomeAssetId,
        );

        state.portfolio = state.portfolio.map(a =>
            a.id === fixedIncomeAssetId ? updatedFixedIncomeAsset : a,
        );

        const cashAssetId = transaction.cashTransaction?.assetId;

        const cashAsset = state.portfolio.find(
            a => a.id === cashAssetId,
        ) as Cash;

        const updatedCashAsset = {
            ...cashAsset,
            balance: cashAsset.balance + transaction.cashBalanceChange,
        };

        state.portfolio = state.portfolio.map(a =>
            a.id === cashAssetId ? updatedCashAsset : a,
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
    addFeesToGroupTransactionOperation(state, action, dispatch) {
        const id = action.input.id;

        const transaction = state.transactions.find(
            transaction => transaction.id === id,
        );

        if (!transaction) {
            throw new Error(`Group transaction with id ${id} does not exist!`);
        }

        const feesToAdd = action.input.fees;

        validateTransactionFees(state, feesToAdd);

        const newFees = transaction.fees ?? [];

        newFees.push(...feesToAdd);

        const newTransaction = {
            ...transaction,
            fees: newFees,
        };

        state.transactions = state.transactions.map(transaction =>
            transaction.id === id ? newTransaction : transaction,
        );
    },
    removeFeesFromGroupTransactionOperation(state, action, dispatch) {
        const id = action.input.id;
        const feeIdsToRemove = action.input.feeIds;

        const transaction = state.transactions.find(
            transaction => transaction.id === id,
        );

        if (!transaction) {
            throw new Error('Transaction does not exist');
        }

        const fees = transaction.fees;

        if (!fees) {
            throw new Error('This transaction has no fees to remove');
        }

        const newFees = fees.filter(fee => !feeIdsToRemove?.includes(fee.id));

        const newTransaction = {
            ...transaction,
            fees: newFees,
        };

        state.transactions = state.transactions.map(transaction =>
            transaction.id === id ? newTransaction : transaction,
        );
    },
    editGroupTransactionFeesOperation(state, action, dispatch) {
        const id = action.input.id;

        const transaction = state.transactions.find(
            transaction => transaction.id === id,
        );

        if (!transaction) {
            throw new Error('Transaction does not exist');
        }

        const feesToUpdate = action.input.fees;

        validateTransactionFees(state, feesToUpdate);

        const fees = transaction.fees;

        if (!fees) {
            throw new Error('This transaction has no fees to update');
        }

        const newFees = fees.map(fee => {
            const feeToUpdate = feesToUpdate.find(f => f.id === fee.id);
            return feeToUpdate ? { ...fee, ...feeToUpdate } : fee;
        });

        const newTransaction = {
            ...transaction,
            fees: newFees,
        };

        state.transactions = state.transactions.map(transaction =>
            transaction.id === id ? newTransaction : transaction,
        );
    },
};
