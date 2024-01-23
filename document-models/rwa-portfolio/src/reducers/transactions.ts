/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { z } from 'zod';
import {
    RwaBaseTransaction,
    RwaGroupTransaction,
    RwaPortfolioState,
} from '../..';
import { GroupTransactionTypeSchema } from '../../gen/schema/zod';
import { RwaPortfolioTransactionsOperations } from '../../gen/transactions/operations';

export function validateRwaBaseTransaction(
    state: RwaPortfolioState,
    input: RwaBaseTransaction,
) {
    if (!input.id) {
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
    const amount = z.number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount must be a positive number',
    });

    amount.positive({ message: 'Amount must be a positive' });
    amount.finite({ message: 'Amount must be finite' });
    amount.safe({
        message:
            'must be between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER',
    });
    const dateSchema = z.coerce.date();
    if (!input.entryTime) {
        throw new Error(`Transaction must have an entry time`);
    }
    if (!dateSchema.safeParse(input.entryTime).success) {
        throw new Error(`Entry time must be a valid date`);
    }
    if (input.tradeTime && !dateSchema.safeParse(input.tradeTime).success) {
        throw new Error(`Trade time must be a valid date`);
    }
    if (
        input.settlementTime &&
        !dateSchema.safeParse(input.settlementTime).success
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

export const reducer: RwaPortfolioTransactionsOperations = {
    createGroupTransactionOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Group transaction must have an id');
        }
        if (
            state.transactions.find(
                transaction => transaction.id === action.input.id,
            )
        ) {
            throw new Error(
                `Group transaction with id ${action.input.id} already exists!`,
            );
        }
        if (!GroupTransactionTypeSchema.safeParse(action.input.type).success) {
            throw new Error(`Invalid group transaction type`);
        }
        if (action.input.assetTransaction) {
            try {
                validateRwaBaseTransaction(
                    state,
                    action.input.assetTransaction,
                );
            } catch (e) {
                console.error(`Invalid asset transaction: `, e);
            }
        }
        if (action.input.cashTransaction) {
            try {
                validateRwaBaseTransaction(state, action.input.cashTransaction);
            } catch (e) {
                console.error(`Invalid cash transaction: `, e);
            }
        }
        if (action.input.interestTransaction) {
            try {
                validateRwaBaseTransaction(
                    state,
                    action.input.interestTransaction,
                );
            } catch (e) {
                console.error(`Invalid interest transaction: `, e);
            }
        }
        if (action.input.feeTransactions?.length) {
            action.input.feeTransactions.forEach(feeTransaction => {
                if (feeTransaction) {
                    try {
                        validateRwaBaseTransaction(state, feeTransaction);
                    } catch (e) {
                        console.error(`Invalid fee transaction: `, e);
                    }
                }
            });
        }
        if (action.input.attachments?.length) {
            action.input.attachments.forEach(attachmentId => {
                if (!state.attachments.find(a => a.id === attachmentId)) {
                    throw new Error(
                        `Attachment with id ${attachmentId} does not exist!`,
                    );
                }
            });
        }
        state.transactions.push(action.input as RwaGroupTransaction);
    },
    editGroupTransactionOperation(state, action, dispatch) {},
    deleteGroupTransactionOperation(state, action, dispatch) {},
};
