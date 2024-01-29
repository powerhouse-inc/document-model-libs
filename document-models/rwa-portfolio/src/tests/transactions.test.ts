/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';
import { reducer } from '../../gen/reducer';
import {
    RwaBaseTransaction,
    RwaGroupTransactionType,
    RwaPortfolioState,
    z,
} from '../../gen/schema';
import * as creators from '../../gen/transactions/creators';
import utils from '../../gen/utils';
import {
    AllowedTransaction,
    AssetPurchase,
    AssetSale,
    InterestDraw,
    InterestReturn,
    PrincipalDraw,
    PrincipalReturn,
    allPossibleAllowedTransactions,
    groupTransactionTypesToAllowedTransactions,
} from '../constants';
import {
    validateCashTransaction,
    validateFeeTransaction,
    validateFixedIncomeTransaction,
    validateHasCorrectTransactions,
    validateInterestTransaction,
    validateRwaBaseTransaction,
} from '../reducers/transactions';
const principalLenderAccount = generateMock(z.RwaAccountSchema());
const counterParty = generateMock(z.RwaAccountSchema());
const cashAsset = generateMock(z.RwaCashSchema());
const fixedIncomeAsset = generateMock(z.RwaFixedIncomeSchema());
const serviceProvider = generateMock(z.RwaServiceProviderSchema());
serviceProvider.accountId = counterParty.id;
const cashTransaction = generateMock(z.RwaBaseTransactionSchema());
cashTransaction.counterParty = principalLenderAccount.id;
cashTransaction.asset = cashAsset.id;
const positiveCashTransaction = {
    ...cashTransaction,
    amount: 100,
};
const negativeCashTransaction = {
    ...cashTransaction,
    amount: -100,
};
const fixedIncomeTransaction = generateMock(z.RwaBaseTransactionSchema());
fixedIncomeTransaction.asset = fixedIncomeAsset.id;
const interestTransaction = generateMock(z.RwaBaseTransactionSchema());
interestTransaction.asset = fixedIncomeAsset.id;
interestTransaction.counterParty = serviceProvider.accountId;

function makeBlankGroupTransactionInput(
    groupTransactionType: RwaGroupTransactionType,
) {
    const input = generateMock(z.RwaGroupTransactionSchema());
    const transactionsType =
        groupTransactionTypesToAllowedTransactions[groupTransactionType];
    input.type = groupTransactionType;
    allPossibleAllowedTransactions.forEach((tx: AllowedTransaction) => {
        if (tx !== transactionsType) {
            // @ts-expect-error mock
            input[tx] = null;
        }
    });

    return input;
}

describe('validateRwaBaseTransaction', () => {
    test('validateRwaBaseTransaction - should throw error when id is missing', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = { asset: 'asset1', amount: 100, entryTime: new Date() };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            'Transaction must have an id',
        );
    });

    test('validateRwaBaseTransaction - should throw error when transaction id already exists', () => {
        const state = {
            transactions: [{ id: 'trans1' }],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = {
            id: 'trans1',
            asset: 'asset1',
            amount: 100,
            entryTime: new Date(),
        };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            `Transaction with id ${input.id} already exists!`,
        );
    });

    test('validateRwaBaseTransaction - should throw error when asset is missing', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = { id: 'trans1', amount: 100, entryTime: new Date() };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            'Transaction must have an asset',
        );
    });

    test('validateRwaBaseTransaction - should throw error when asset does not exist', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = {
            id: 'trans1',
            asset: 'not-existent-asset',
            amount: 100,
            entryTime: new Date(),
        };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            `Asset with id ${input.asset} does not exist!`,
        );
    });

    test('validateRwaBaseTransaction - should throw error when amount is missing', () => {
        const state = {
            transactions: [],
            accounts: [],
            portfolio: [{ id: 'asset1' }],
        };
        const input = { id: 'trans1', asset: 'asset1', entryTime: new Date() };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            'Transaction must have an amount',
        );
    });

    test('validateRwaBaseTransaction - should throw error when entryTime is missing', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = { id: 'trans1', asset: 'asset1', amount: 100 };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            'Transaction must have an entry time',
        );
    });

    test('validateRwaBaseTransaction - should throw error when entryTime is not a valid date', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = {
            id: 'trans1',
            asset: 'asset1',
            amount: 100,
            entryTime: 'invalid date',
        };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            'Entry time must be a valid date',
        );
    });

    test('validateRwaBaseTransaction - should throw error when tradeTime is not a valid date', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = {
            id: 'trans1',
            asset: 'asset1',
            amount: 100,
            entryTime: new Date(),
            tradeTime: 'invalid date',
        };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            'Trade time must be a valid date',
        );
    });

    test('validateRwaBaseTransaction - should throw error when settlementTime is not a valid date', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = {
            id: 'trans1',
            asset: 'asset1',
            amount: 100,
            entryTime: new Date(),
            settlementTime: 'invalid date',
        };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            'Settlement time must be a valid date',
        );
    });

    test('validateRwaBaseTransaction - should throw error when account does not exist', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = {
            id: 'trans1',
            asset: 'asset1',
            amount: 100,
            entryTime: new Date(),
            account: 'account1',
        };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            `Account with id ${input.account} does not exist!`,
        );
    });

    test('validateRwaBaseTransaction - should throw error when counterParty does not exist', () => {
        const state = {
            transactions: [],
            portfolio: [{ id: 'asset1' }],
            accounts: [],
        };
        const input = {
            id: 'trans1',
            asset: 'asset1',
            amount: 100,
            entryTime: new Date(),
            counterParty: 'counterParty1',
        };
        // @ts-expect-error mock
        expect(() => validateRwaBaseTransaction(state, input)).toThrow(
            `Counter party account with id ${input.counterParty} does not exist!`,
        );
    });
});

describe('validateHasCorrectTransactions', () => {
    // Test cases for PrincipalDraw
    it('should allow cashTransaction for PrincipalDraw', () => {
        const input = {
            cashTransaction: {},
        };
        expect(() =>
            // @ts-expect-error mock
            validateHasCorrectTransactions('PrincipalDraw', input),
        ).not.toThrow();
    });

    it('should not allow other transactions for PrincipalDraw', () => {
        const transactionTypes = [
            'fixedIncomeTransaction',
            'interestTransaction',
            'feeTransactions',
        ];
        transactionTypes.forEach(tx => {
            const input = {
                [tx]: {},
            };
            expect(() =>
                validateHasCorrectTransactions('PrincipalDraw', input),
            ).toThrow();
        });
    });

    // Test cases for PrincipalReturn
    it('should allow cashTransaction for PrincipalReturn', () => {
        const input = {
            cashTransaction: {},
        };
        expect(() =>
            // @ts-expect-error mock
            validateHasCorrectTransactions('PrincipalReturn', input),
        ).not.toThrow();
    });

    it('should not allow other transactions for PrincipalReturn', () => {
        const transactionTypes = [
            'fixedIncomeTransaction',
            'interestTransaction',
            'feeTransactions',
        ];
        transactionTypes.forEach(tx => {
            const input = {
                [tx]: {},
            };
            expect(() =>
                validateHasCorrectTransactions('PrincipalReturn', input),
            ).toThrow();
        });
    });

    // Test cases for AssetPurchase
    it('should allow fixedIncomeTransaction for AssetPurchase', () => {
        const input = {
            fixedIncomeTransaction: {},
        };
        expect(() =>
            // @ts-expect-error mock
            validateHasCorrectTransactions('AssetPurchase', input),
        ).not.toThrow();
    });

    it('should not allow other transactions for AssetPurchase', () => {
        const transactionTypes = [
            'cashTransaction',
            'interestTransaction',
            'feeTransactions',
        ];
        transactionTypes.forEach(tx => {
            const input = {
                [tx]: {},
            };
            expect(() =>
                validateHasCorrectTransactions('AssetPurchase', input),
            ).toThrow();
        });
    });

    // Test cases for AssetSale
    it('should allow fixedIncomeTransaction for AssetSale', () => {
        const input = {
            fixedIncomeTransaction: {},
        };
        expect(() =>
            // @ts-expect-error mock
            validateHasCorrectTransactions('AssetSale', input),
        ).not.toThrow();
    });

    it('should not allow other transactions for AssetSale', () => {
        const transactionTypes = [
            'cashTransaction',
            'interestTransaction',
            'feeTransactions',
        ];
        transactionTypes.forEach(tx => {
            const input = {
                [tx]: {},
            };
            expect(() =>
                validateHasCorrectTransactions('AssetSale', input),
            ).toThrow();
        });
    });

    // Test cases for InterestDraw
    it('should allow interestTransaction for InterestDraw', () => {
        const input = {
            interestTransaction: {},
        };
        expect(() =>
            // @ts-expect-error mock
            validateHasCorrectTransactions('InterestDraw', input),
        ).not.toThrow();
    });

    it('should not allow other transactions for InterestDraw', () => {
        const transactionTypes = [
            'cashTransaction',
            'fixedIncomeTransaction',
            'feeTransactions',
        ];
        transactionTypes.forEach(tx => {
            const input = {
                [tx]: {},
            };
            expect(() =>
                validateHasCorrectTransactions('InterestDraw', input),
            ).toThrow();
        });
    });

    // Test cases for InterestReturn
    it('should allow interestTransaction for InterestReturn', () => {
        const input = {
            interestTransaction: {},
        };
        expect(() =>
            // @ts-expect-error mock
            validateHasCorrectTransactions('InterestReturn', input),
        ).not.toThrow();
    });

    it('should not allow other transactions for InterestReturn', () => {
        const transactionTypes = [
            'cashTransaction',
            'fixedIncomeTransaction',
            'feeTransactions',
        ];
        transactionTypes.forEach(tx => {
            const input = {
                [tx]: {},
            };
            expect(() =>
                validateHasCorrectTransactions('InterestReturn', input),
            ).toThrow();
        });
    });

    // Test cases for FeesPayment
    it('should allow feeTransactions for FeesPayment', () => {
        const input = {
            feeTransactions: [{}],
        };
        expect(() =>
            // @ts-expect-error mock
            validateHasCorrectTransactions('FeesPayment', input),
        ).not.toThrow();
    });

    it('should not allow other transactions for FeesPayment', () => {
        const transactionTypes = [
            'cashTransaction',
            'fixedIncomeTransaction',
            'interestTransaction',
        ];
        transactionTypes.forEach(tx => {
            const input = {
                [tx]: {},
            };
            expect(() =>
                validateHasCorrectTransactions('FeesPayment', input),
            ).toThrow();
        });
    });

    // Additional test cases can include testing for multiple transactions, empty input, and invalid transaction types.
});

describe('validateFixedIncomeTransaction', () => {
    it('should throw an error when the asset is not a fixed income asset', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                // @ts-expect-error mock
                { id: '1', spv: 'equity' },
            ],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = { asset: '1' };

        expect(() =>
            validateFixedIncomeTransaction(state, transaction),
        ).toThrow(
            'Fixed income transaction must have a fixed income asset as the asset',
        );
    });

    it('should not throw an error when the asset is a fixed income asset', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                // @ts-expect-error mock
                { id: '1', type: 'fixed_income' },
            ],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = { asset: '1' };

        expect(() =>
            validateFixedIncomeTransaction(state, transaction),
        ).not.toThrow();
    });
});

describe('validateCashTransaction', () => {
    it('should throw an error when the counterParty is not the principalLender', () => {
        const state: RwaPortfolioState = {
            principalLender: 'principalLender1',
            portfolio: [
                // @ts-expect-error mock
                { id: '1', type: 'cash' },
            ],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'counterParty1',
        };

        expect(() => validateCashTransaction(state, transaction)).toThrow(
            'Cash transaction must have Maker principal lender as the counter party',
        );
    });

    it('should throw an error when the asset is not a cash asset', () => {
        const state: RwaPortfolioState = {
            principalLender: 'principalLender1',
            // @ts-expect-error mock
            portfolio: [{ id: '1', type: 'equity' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'principalLender1',
        };

        expect(() => validateCashTransaction(state, transaction)).toThrow(
            'Cash transaction must have a cash asset as the asset',
        );
    });

    it('should not throw an error when the counterParty is the principalLender and the asset is a cash asset', () => {
        const state: RwaPortfolioState = {
            principalLender: 'principalLender1',
            // @ts-expect-error mock
            portfolio: [{ id: '1', spv: 'cash' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'principalLender1',
        };

        expect(() => validateCashTransaction(state, transaction)).not.toThrow();
    });
});

describe('validateInterestTransaction', () => {
    it('should throw an error when the asset is a cash asset', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', spv: 'cash' }],
            // @ts-expect-error mock
            feeTypes: [{ id: 'serviceProvider1' }],
            // @ts-expect-error mock
            accounts: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: 100,
        };

        expect(() => validateInterestTransaction(state, transaction)).toThrow(
            'Interest transaction must have a fixed income asset as the asset',
        );
    });

    it('should throw an error when the counterParty is not provided', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', type: 'fixed_income' }],
            // @ts-expect-error mock
            feeTypes: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = { asset: '1', amount: 100 };

        expect(() => validateInterestTransaction(state, transaction)).toThrow(
            'Interest transaction must have a counter party account',
        );
    });

    it('should throw an error when the counterParty is not a known service provider', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', type: 'fixed_income' }],
            // @ts-expect-error mock
            feeTypes: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'unknownServiceProvider',
            amount: 100,
        };

        expect(() => validateInterestTransaction(state, transaction)).toThrow(
            'Counter party with id unknownServiceProvider must be a known service provider',
        );
    });

    it('should throw an error when the amount is not positive', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', type: 'fixed_income' }],
            // @ts-expect-error mock
            feeTypes: [{ accountId: 'serviceProvider1' }],
            // @ts-expect-error mock
            accounts: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: -100,
        };

        expect(() => validateInterestTransaction(state, transaction)).toThrow(
            'Interest transaction amount must be positive',
        );
    });

    it('should not throw an error when the asset is not a cash asset, the counterParty is provided and is a known service provider, and the amount is positive', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', type: 'fixed_income' }],
            // @ts-expect-error mock
            feeTypes: [{ accountId: 'serviceProvider1' }],
            // @ts-expect-error mock
            accounts: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: 100,
        };

        expect(() =>
            validateInterestTransaction(state, transaction),
        ).not.toThrow();
    });
});

describe('validateFeeTransaction', () => {
    it('should throw an error when the asset is not a cash asset', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', type: 'equity' }],
            // @ts-expect-error mock
            feeTypes: [{ accountId: 'serviceProvider1' }],
            // @ts-expect-error mock
            accounts: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: -100,
        };

        expect(() => validateFeeTransaction(state, transaction)).toThrow(
            'Fee transaction must have a cash asset as the asset',
        );
    });

    it('should throw an error when the counterParty is not provided', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', spv: 'cash' }],
            // @ts-expect-error mock
            feeTypes: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = { asset: '1', amount: -100 };

        expect(() => validateFeeTransaction(state, transaction)).toThrow(
            'Fee transaction must have a counter party account',
        );
    });

    it('should throw an error when the counterParty is not a known service provider', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', spv: 'cash' }],
            // @ts-expect-error mock
            feeTypes: [{ accountId: 'serviceProvider1' }],
            // @ts-expect-error mock
            accounts: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'unknownServiceProvider',
            amount: -100,
        };

        expect(() => validateFeeTransaction(state, transaction)).toThrow(
            'Counter party with id unknownServiceProvider must be a known service provider',
        );
    });

    it('should throw an error when the amount is not negative', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', spv: 'cash' }],
            // @ts-expect-error mock
            feeTypes: [{ accountId: 'serviceProvider1' }],
            // @ts-expect-error mock
            accounts: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: 100,
        };

        expect(() => validateFeeTransaction(state, transaction)).toThrow(
            'Fee transaction amount must be negative',
        );
    });

    it('should not throw an error when the asset is a cash asset, the counterParty is provided and is a known service provider, and the amount is negative', () => {
        const state: RwaPortfolioState = {
            // @ts-expect-error mock
            portfolio: [{ id: '1', spv: 'cash' }],
            // @ts-expect-error mock
            feeTypes: [{ accountId: 'serviceProvider1' }],
            // @ts-expect-error mock
            accounts: [{ id: 'serviceProvider1' }],
        };
        // @ts-expect-error mock
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: -100,
        };

        expect(() => validateFeeTransaction(state, transaction)).not.toThrow();
    });
});

describe('Transactions Operations', () => {
    const document = utils.createDocument({
        state: {
            global: {
                accounts: [principalLenderAccount, counterParty],
                principalLender: principalLenderAccount.id,
                spvs: [],
                feeTypes: [serviceProvider],
                fixedIncomeTypes: [],
                portfolio: [cashAsset, fixedIncomeAsset],
                transactions: [],
            },
            local: {},
        },
    });
    test('createPrincipalDrawGroupTransactionOperation', () => {
        const input = makeBlankGroupTransactionInput(PrincipalDraw);
        // @ts-expect-error mock
        input.cashTransaction = positiveCashTransaction;
        const updatedDocument = reducer(
            document,
            creators.createPrincipalDrawGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_PRINCIPAL_DRAW_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    test('createPrincipalReturnGroupTransactionOperation', () => {
        const input = makeBlankGroupTransactionInput(PrincipalReturn);
        // @ts-expect-error mock
        input.cashTransaction = negativeCashTransaction;
        const updatedDocument = reducer(
            document,
            creators.createPrincipalReturnGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_PRINCIPAL_RETURN_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    test('createAssetSaleGroupTransactionOperation', () => {
        const input = makeBlankGroupTransactionInput(AssetSale);
        // @ts-expect-error mock
        input.fixedIncomeTransaction = fixedIncomeTransaction;
        const updatedDocument = reducer(
            document,
            creators.createAssetSaleGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_ASSET_SALE_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    test('createAssetPurchaseGroupTransactionOperation', () => {
        const input = makeBlankGroupTransactionInput(AssetPurchase);
        // @ts-expect-error mock
        input.fixedIncomeTransaction = fixedIncomeTransaction;
        const updatedDocument = reducer(
            document,
            creators.createAssetPurchaseGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_ASSET_PURCHASE_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    test('createInterestDrawGroupTransactionOperation', () => {
        const input = makeBlankGroupTransactionInput(InterestDraw);
        // @ts-expect-error mock
        input.interestTransaction = interestTransaction;
        const updatedDocument = reducer(
            document,
            creators.createInterestDrawGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_INTEREST_DRAW_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    test('createInterestReturnGroupTransactionOperation', () => {
        const input = makeBlankGroupTransactionInput(InterestReturn);
        // @ts-expect-error mock
        input.interestTransaction = interestTransaction;
        const updatedDocument = reducer(
            document,
            creators.createInterestReturnGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_INTEREST_RETURN_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteGroupTransaction operation', () => {
        const existingGroupTransaction =
            makeBlankGroupTransactionInput(PrincipalDraw);
        const input = makeBlankGroupTransactionInput(PrincipalDraw);
        input.id = existingGroupTransaction.id;
        const initialDocument = utils.createDocument({
            ...document,
            state: {
                ...document.state,
                global: {
                    ...document.state.global,
                    transactions: [existingGroupTransaction],
                },
            },
        });

        const updatedDocument = reducer(
            initialDocument,
            creators.deleteGroupTransaction(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
