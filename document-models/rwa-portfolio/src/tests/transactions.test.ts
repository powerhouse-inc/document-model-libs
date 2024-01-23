/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import { reducer } from '../../gen/reducer';
import { z } from '../../gen/schema';
import * as creators from '../../gen/transactions/creators';
import { RwaPortfolioDocument } from '../../gen/types';
import utils from '../../gen/utils';
import { validateRwaBaseTransaction } from '../reducers/transactions';

describe('Transactions Operations', () => {
    let document: RwaPortfolioDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

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

    it('should handle createGroupTransaction operation', () => {
        const baseTransactionId = 'base-test-id';
        const groupTransactionId = 'group-test-id';
        const asset = generateMock(z.RwaAssetSchema());
        const amount = 123;
        const account = generateMock(z.RwaAccountSchema());
        const counterParty = generateMock(z.RwaAccountSchema());
        const txRef = 'tx-ref';
        const entryTime = new Date().toISOString();
        const tradeTime = new Date().toISOString();
        const settlementTime = new Date().toISOString();
        const baseTransaction = {
            id: baseTransactionId,
            asset: asset.id,
            amount,
            account: account.id,
            counterParty: counterParty.id,
            txRef,
            entryTime,
            tradeTime,
            settlementTime,
        };
        const groupTransaction = {
            id: groupTransactionId,
            type: 'AssetPurchase',
            assetTransaction: baseTransaction,
            cashTransaction: baseTransaction,
            interestTransaction: baseTransaction,
            feeTransactions: [baseTransaction],
            attachments: [] as string[],
        };
        const document = utils.createDocument({
            state: {
                global: {
                    accounts: [account, counterParty],
                    principalLender: account.id,
                    spvs: [],
                    feeTypes: [],
                    fixedIncomeTypes: [],
                    attachments: [],
                    portfolio: [asset],
                    transactions: [],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            // @ts-expect-error mock
            creators.createGroupTransaction(groupTransaction),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(
            groupTransaction,
        );
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editGroupTransaction operation', () => {
        const input = generateMock(z.EditGroupTransactionInputSchema());
        const updatedDocument = reducer(
            document,
            creators.editGroupTransaction(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'EDIT_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteGroupTransaction operation', () => {
        const input = generateMock(z.DeleteGroupTransactionInputSchema());
        const updatedDocument = reducer(
            document,
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
