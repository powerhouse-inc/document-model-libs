/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { z } from 'zod';
import {
    InputMaybe,
    RwaBaseTransaction,
    RwaGroupTransaction,
    RwaPortfolioState,
} from '../..';
import { GroupTransactionTypeSchema } from '../../gen/schema/zod';
import { RwaPortfolioTransactionsOperations } from '../../gen/transactions/operations';

export function validateRwaBaseTransaction(
    state: RwaPortfolioState,
    input: InputMaybe<RwaBaseTransaction>,
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

export function validateInputTransactions(
    state: RwaPortfolioState,
    input: {
        assetTransaction?: InputMaybe<RwaBaseTransaction>;
        cashTransaction?: InputMaybe<RwaBaseTransaction>;
        interestTransaction?: InputMaybe<RwaBaseTransaction>;
        feeTransactions?: InputMaybe<InputMaybe<RwaBaseTransaction>[]>;
    },
) {
    if (input.assetTransaction) {
        validateRwaBaseTransaction(state, input.assetTransaction);
    }
    if (input.cashTransaction) {
        validateRwaBaseTransaction(state, input.cashTransaction);
    }
    if (input.interestTransaction) {
        validateRwaBaseTransaction(state, input.interestTransaction);
    }
    if (input.feeTransactions?.length) {
        input.feeTransactions.forEach(feeTransaction => {
            validateRwaBaseTransaction(state, feeTransaction);
        });
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
        validateInputTransactions(state, action.input);
        state.transactions.push(action.input as RwaGroupTransaction);
    },
    editGroupTransactionOperation(state, action, dispatch) {
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
            action.input.type &&
            !GroupTransactionTypeSchema.safeParse(action.input.type).success
        ) {
            throw new Error(`Invalid group transaction type`);
        }
        validateInputTransactions(state, action.input);
        state.transactions = state.transactions.map(t =>
            t.id === action.input.id
                ? ({
                      ...t,
                      ...action.input,
                  } as RwaGroupTransaction)
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
