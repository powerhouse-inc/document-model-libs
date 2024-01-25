/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import { RwaBaseTransaction, RwaPortfolioState, z } from '../../gen/schema';
import {
    validateCashTransaction,
    validateFeeTransaction,
    validateFixedIncomeTransaction,
    validateInterestTransaction,
    validateRwaBaseTransaction,
} from '../reducers/transactions';
const principalLenderAccount = generateMock(z.RwaAccountSchema());
const counterParty = generateMock(z.RwaAccountSchema());
const cashAsset = generateMock(z.RwaCashSchema());
const fixedIncomeAsset = generateMock(z.RwaFixedIncomeSchema());

function makeBlankGroupTransactionInput() {
    const input = generateMock(z.RwaGroupTransactionSchema());
    input.cashTransaction = null;
    input.fixedIncomeTransaction = null;
    input.interestTransaction = null;
    input.feeTransactions = [];
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

describe('validateFixedIncomeTransaction', () => {
    it('should throw an error when the asset is not a fixed income asset', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', spv: 'equity' }, // assuming type property determines the asset type
            ],
        };
        const transaction: RwaBaseTransaction = { asset: '1' }; // replace with actual transaction structure

        expect(() =>
            validateFixedIncomeTransaction(state, transaction),
        ).toThrow(
            'Fixed income transaction must have a fixed income asset as the asset',
        );
    });

    it('should not throw an error when the asset is a fixed income asset', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', type: 'fixed_income' }, // assuming type property determines the asset type
            ],
        };
        const transaction: RwaBaseTransaction = { asset: '1' }; // replace with actual transaction structure

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
                { id: '1', type: 'cash' }, // assuming type property determines the asset type
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'counterParty1',
        }; // replace with actual transaction structure

        expect(() => validateCashTransaction(state, transaction)).toThrow(
            'Cash transaction must have Maker principal lender as the counter party',
        );
    });

    it('should throw an error when the asset is not a cash asset', () => {
        const state: RwaPortfolioState = {
            principalLender: 'principalLender1',
            portfolio: [
                { id: '1', type: 'equity' }, // assuming type property determines the asset type
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'principalLender1',
        }; // replace with actual transaction structure

        expect(() => validateCashTransaction(state, transaction)).toThrow(
            'Cash transaction must have a cash asset as the asset',
        );
    });

    it('should not throw an error when the counterParty is the principalLender and the asset is a cash asset', () => {
        const state: RwaPortfolioState = {
            principalLender: 'principalLender1',
            portfolio: [
                { id: '1', spv: 'cash' }, // assuming type property determines the asset type
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'principalLender1',
        }; // replace with actual transaction structure

        expect(() => validateCashTransaction(state, transaction)).not.toThrow();
    });
});

describe('validateInterestTransaction', () => {
    it('should throw an error when the asset is a cash asset', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', spv: 'cash' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: 100,
        }; // replace with actual transaction structure

        expect(() => validateInterestTransaction(state, transaction)).toThrow(
            'Interest transaction must have a cash asset as the asset',
        );
    });

    it('should throw an error when the counterParty is not provided', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', type: 'fixed_income' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = { asset: '1', amount: 100 }; // replace with actual transaction structure

        expect(() => validateInterestTransaction(state, transaction)).toThrow(
            'Interest transaction must have a counter party account',
        );
    });

    it('should throw an error when the counterParty is not a known service provider', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', type: 'fixed_income' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'unknownServiceProvider',
            amount: 100,
        }; // replace with actual transaction structure

        expect(() => validateInterestTransaction(state, transaction)).toThrow(
            'Counter party with id unknownServiceProvider must be a known service provider',
        );
    });

    it('should throw an error when the amount is not positive', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', type: 'fixed_income' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: -100,
        }; // replace with actual transaction structure

        expect(() => validateInterestTransaction(state, transaction)).toThrow(
            'Interest transaction amount must be positive',
        );
    });

    it('should not throw an error when the asset is not a cash asset, the counterParty is provided and is a known service provider, and the amount is positive', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', type: 'fixed_income' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: 100,
        }; // replace with actual transaction structure

        expect(() =>
            validateInterestTransaction(state, transaction),
        ).not.toThrow();
    });
});

describe('validateFeeTransaction', () => {
    it('should throw an error when the asset is not a cash asset', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', type: 'equity' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: -100,
        }; // replace with actual transaction structure

        expect(() => validateFeeTransaction(state, transaction)).toThrow(
            'Fee transaction must have a cash asset as the asset',
        );
    });

    it('should throw an error when the counterParty is not provided', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', spv: 'cash' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = { asset: '1', amount: -100 }; // replace with actual transaction structure

        expect(() => validateFeeTransaction(state, transaction)).toThrow(
            'Fee transaction must have a counter party account',
        );
    });

    it('should throw an error when the counterParty is not a known service provider', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', spv: 'cash' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'unknownServiceProvider',
            amount: -100,
        }; // replace with actual transaction structure

        expect(() => validateFeeTransaction(state, transaction)).toThrow(
            'Counter party with id unknownServiceProvider must be a known service provider',
        );
    });

    it('should throw an error when the amount is not negative', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', spv: 'cash' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: 100,
        }; // replace with actual transaction structure

        expect(() => validateFeeTransaction(state, transaction)).toThrow(
            'Fee transaction amount must be negative',
        );
    });

    it('should not throw an error when the asset is a cash asset, the counterParty is provided and is a known service provider, and the amount is negative', () => {
        const state: RwaPortfolioState = {
            portfolio: [
                { id: '1', spv: 'cash' }, // assuming type property determines the asset type
            ],
            feeTypes: [
                { id: 'serviceProvider1' }, // assuming id property determines the service provider
            ],
        };
        const transaction: RwaBaseTransaction = {
            asset: '1',
            counterParty: 'serviceProvider1',
            amount: -100,
        }; // replace with actual transaction structure

        expect(() => validateFeeTransaction(state, transaction)).not.toThrow();
    });
});

// describe('Transactions Operations', () => {
//     const document = utils.createDocument({
//         state: {
//             global: {
//                 accounts: [principalLenderAccount, counterParty],
//                 principalLender: principalLenderAccount.id,
//                 spvs: [],
//                 feeTypes: [],
//                 fixedIncomeTypes: [],
//                 portfolio: [cashAsset, fixedIncomeAsset],
//                 transactions: [],
//             },
//             local: {},
//         },
//     });

//     it('should handle createGroupTransaction operation with no transactions to validate', () => {
//         const input = makeBlankGroupTransactionInput();
//         const updatedDocument = reducer(
//             document,
//             creators.createGroupTransaction(input),
//         );

//         expect(updatedDocument.operations.global).toHaveLength(1);
//         expect(updatedDocument.operations.global[0].type).toBe(
//             'CREATE_GROUP_TRANSACTION',
//         );
//         expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
//         expect(updatedDocument.operations.global[0].index).toEqual(0);
//     });
//     it('should handle createGroupTransaction with cash transaction', () => {
//         const input = makeBlankGroupTransactionInput();
//     });
//     it('should handle editGroupTransaction operation', () => {
//         const document = utils.createDocument({
//             state: {
//                 global: {
//                     accounts: [account, counterParty],
//                     principalLender: counterParty.id,
//                     spvs: [],
//                     feeTypes: [],
//                     fixedIncomeTypes: [],
//                     portfolio: [cashAsset],
//                     // @ts-expect-error mock
//                     transactions: [groupTransaction],
//                 },
//                 local: {},
//             },
//         });
//         const updatedGroupTransaction = {
//             ...groupTransaction,
//             counterParty: counterParty.id,
//             asset: cashAsset.id,
//             type: 'AssetSale',
//         };
//         const updatedDocument = reducer(
//             document,
//             // @ts-expect-error mock
//             creators.editGroupTransaction(updatedGroupTransaction),
//         );

//         expect(updatedDocument.operations.global).toHaveLength(1);
//         expect(updatedDocument.operations.global[0].type).toBe(
//             'EDIT_GROUP_TRANSACTION',
//         );
//         expect(updatedDocument.operations.global[0].input).toStrictEqual(
//             updatedGroupTransaction,
//         );
//         expect(updatedDocument.operations.global[0].index).toEqual(0);
//     });
//     it('should handle deleteGroupTransaction operation', () => {
//         const input = { id: groupTransactionId };
//         const document = utils.createDocument({
//             state: {
//                 global: {
//                     accounts: [account, counterParty],
//                     principalLender: account.id,
//                     spvs: [],
//                     feeTypes: [],
//                     fixedIncomeTypes: [],
//                     portfolio: [asset],
//                     // @ts-expect-error mock
//                     transactions: [groupTransaction],
//                 },
//                 local: {},
//             },
//         });
//         const updatedDocument = reducer(
//             document,
//             creators.deleteGroupTransaction({ id: groupTransactionId }),
//         );

//         expect(updatedDocument.operations.global).toHaveLength(1);
//         expect(updatedDocument.operations.global[0].type).toBe(
//             'DELETE_GROUP_TRANSACTION',
//         );
//         expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
//         expect(updatedDocument.operations.global[0].index).toEqual(0);
//     });
// });
