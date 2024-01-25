/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { z } from 'zod';
import {
    CashGroupTransactionType,
    FixedIncomeGroupTransactionType,
    GroupTransactionType,
    InputMaybe,
    RwaAsset,
    RwaBaseTransaction,
    RwaCash,
    RwaFixedIncome,
    RwaGroupTransaction,
    RwaPortfolioState,
} from '../..';
import {
    CashGroupTransactionTypeSchema,
    FixedIncomeGroupTransactionTypeSchema,
    GroupTransactionTypeSchema,
} from '../../gen/schema/zod';
import { RwaPortfolioTransactionsOperations } from '../../gen/transactions/operations';

const numberValidator = z.number({
    required_error: 'Amount is required',
    invalid_type_error: 'Amount must be a number',
});

const dateValidator = z.coerce.date();

export function isFixedIncomeAsset(asset: RwaAsset): asset is RwaFixedIncome {
    return 'type' in asset;
}

export function isCashAsset(asset: RwaAsset): asset is RwaCash {
    return 'spv' in asset;
}

export function isCashAssetGroupTransactionType(
    transactionType: RwaGroupTransaction['type'],
): transactionType is CashGroupTransactionType {
    return CashGroupTransactionTypeSchema.safeParse(transactionType).success;
}

export function isFixedIncomeAssetGroupTransactionType(
    transactionType: RwaGroupTransaction['type'],
): transactionType is FixedIncomeGroupTransactionType {
    return FixedIncomeGroupTransactionTypeSchema.safeParse(transactionType)
        .success;
}

export function hasCashAssetTransaction(transaction: RwaGroupTransaction) {
    return Boolean(transaction.cashTransaction);
}

export function hasFixedIncomeAssetTransaction(
    transaction: RwaGroupTransaction,
) {
    return Boolean(
        transaction.fixedIncomeTransaction ||
            transaction.interestTransaction ||
            transaction.feeTransactions?.length,
    );
}

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
    if (!input.entryTime) {
        throw new Error(`Transaction must have an entry time`);
    }

    numberValidator
        .finite({ message: 'Amount must be finite' })
        .safeParse(input.amount);

    numberValidator
        .safe({
            message:
                'must be between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER',
        })
        .safeParse(input.amount);

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

export function validateInputTransactions(
    state: RwaPortfolioState,
    input: {
        fixedIncomeTransaction?: InputMaybe<RwaBaseTransaction>;
        cashTransaction?: InputMaybe<RwaBaseTransaction>;
        interestTransaction?: InputMaybe<RwaBaseTransaction>;
        feeTransactions?: InputMaybe<InputMaybe<RwaBaseTransaction>[]>;
    },
) {
    if (input.fixedIncomeTransaction) {
        validateRwaBaseTransaction(state, input.fixedIncomeTransaction);
        validateFixedIncomeTransaction(state, input.fixedIncomeTransaction);
    }
    if (input.cashTransaction) {
        validateRwaBaseTransaction(state, input.cashTransaction);
        validateCashTransaction(state, input.cashTransaction);
    }
    if (input.interestTransaction) {
        validateRwaBaseTransaction(state, input.interestTransaction);
        validateInterestTransaction(state, input.interestTransaction);
    }
    if (input.feeTransactions?.length) {
        input.feeTransactions.forEach(feeTransaction => {
            if (!feeTransaction) return;
            validateRwaBaseTransaction(state, feeTransaction);
            validateFeeTransaction(state, feeTransaction);
        });
    }
}

export function validateFixedIncomeTransaction(
    state: RwaPortfolioState,
    transaction: RwaBaseTransaction,
) {
    if (
        !isFixedIncomeAsset(
            state.portfolio.find(a => a.id === transaction.asset)!,
        )
    ) {
        throw new Error(
            `Fixed income transaction must have a fixed income asset as the asset`,
        );
    }
}

export function validateCashTransaction(
    state: RwaPortfolioState,
    transaction: RwaBaseTransaction,
) {
    if (transaction.counterParty !== state.principalLender) {
        throw new Error(
            `Cash transaction must have Maker principal lender as the counter party`,
        );
    }
    if (!isCashAsset(state.portfolio.find(a => a.id === transaction.asset)!)) {
        throw new Error(`Cash transaction must have a cash asset as the asset`);
    }
}

export function validateInterestTransaction(
    state: RwaPortfolioState,
    transaction: RwaBaseTransaction,
) {
    if (
        !isFixedIncomeAsset(
            state.portfolio.find(a => a.id === transaction.asset)!,
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
    state: RwaPortfolioState,
    transaction: RwaBaseTransaction,
) {
    if (!isCashAsset(state.portfolio.find(a => a.id === transaction.asset)!)) {
        throw new Error(`Fee transaction must have a cash asset as the asset`);
    }
    if (!transaction.counterParty) {
        throw new Error(`Fee transaction must have a counter party account`);
    }
    if (!state.feeTypes.find(a => a.id === transaction.counterParty)) {
        throw new Error(
            `Counter party with id ${transaction.counterParty} must be a known service provider`,
        );
    }
    if (!numberValidator.negative().safeParse(transaction.amount).success) {
        throw new Error('Fee transaction amount must be negative');
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
        if (
            !GroupTransactionTypeSchema().safeParse(action.input.type).success
        ) {
            throw new Error(`Invalid group transaction type`);
        }
        if (
            isCashAssetGroupTransactionType(action.input.type) &&
            hasFixedIncomeAssetTransaction(action.input as RwaGroupTransaction)
        ) {
            throw new Error(
                `Cash group transaction cannot have a fixed income asset transaction`,
            );
        }
        if (
            isFixedIncomeAssetGroupTransactionType(action.input.type) &&
            hasCashAssetTransaction(action.input as RwaGroupTransaction)
        ) {
            throw new Error(
                `Fixed income group transaction cannot have a cash asset transaction`,
            );
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
        if (action.input.type) {
            if (
                !GroupTransactionTypeSchema().safeParse(action.input.type)
                    .success
            ) {
                throw new Error(`Invalid group transaction type`);
            }
            if (
                isCashAssetGroupTransactionType(action.input.type) &&
                hasFixedIncomeAssetTransaction(transaction)
            ) {
                throw new Error(
                    `This group transaction cannot be converted to a cash group transaction because it has a fixed income asset transaction`,
                );
            }
            if (
                isFixedIncomeAssetGroupTransactionType(action.input.type) &&
                hasCashAssetTransaction(transaction)
            ) {
                throw new Error(
                    `This group transaction cannot be converted to a fixed income group transaction because it has a cash asset transaction`,
                );
            }
        }
        if (
            hasCashAssetTransaction(action.input as RwaGroupTransaction) &&
            isFixedIncomeAssetGroupTransactionType(
                transaction.type as GroupTransactionType,
            )
        ) {
            throw new Error(
                `Cash group transaction cannot have a fixed income asset transaction`,
            );
        }
        if (
            hasFixedIncomeAssetTransaction(
                action.input as RwaGroupTransaction,
            ) &&
            isCashAssetGroupTransactionType(
                transaction.type as GroupTransactionType,
            )
        ) {
            throw new Error(
                `Fixed income group transaction cannot have a cash asset transaction`,
            );
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
