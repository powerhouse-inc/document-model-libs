/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';
import { reducer } from '../../gen/reducer';
import { z } from '../../gen/schema';
import * as creators from '../../gen/transactions/creators';
import utils from '../../gen/utils';
import {
    ASSET_PURCHASE,
    ASSET_SALE,
    INTEREST_DRAW,
    INTEREST_RETURN,
    PRINCIPAL_DRAW,
    PRINCIPAL_RETURN,
} from '../constants';
import { makeEmptyGroupTransactionByType } from '../utils';
const principalLenderAccount = generateMock(z.AccountSchema());
const mockCounterParty = generateMock(z.AccountSchema());
const mockCashAsset = generateMock(z.CashSchema());
const mockFixedIncomeAsset = generateMock(z.FixedIncomeSchema());
mockFixedIncomeAsset.maturity = new Date(
    new Date().getTime() + 1000 * 60 * 60 * 24 * 365,
).toISOString();
const mockServiceProvider = generateMock(z.ServiceProviderSchema());
mockServiceProvider.accountId = mockCounterParty.id;
const mockCashTransaction = generateMock(z.BaseTransactionSchema());
mockCashTransaction.counterPartyAccountId = principalLenderAccount.id;
mockCashTransaction.assetId = mockCashAsset.id;
const positiveMockCashTransaction = {
    ...mockCashTransaction,
    amount: 100,
};
const negativeMockCashTransaction = {
    ...mockCashTransaction,
    amount: -100,
};
const mockFixedIncomeTransaction = generateMock(z.BaseTransactionSchema());
mockFixedIncomeTransaction.assetId = mockFixedIncomeAsset.id;
mockFixedIncomeTransaction;
const mockInterestTransaction = generateMock(z.BaseTransactionSchema());
mockInterestTransaction.assetId = mockFixedIncomeAsset.id;
mockInterestTransaction.counterPartyAccountId = mockServiceProvider.accountId;

describe('Transactions Operations', () => {
    const document = utils.createDocument({
        state: {
            global: {
                accounts: [principalLenderAccount, mockCounterParty],
                principalLenderAccountId: principalLenderAccount.id,
                spvs: [],
                feeTypes: [mockServiceProvider],
                fixedIncomeTypes: [],
                portfolio: [mockCashAsset, mockFixedIncomeAsset],
                transactions: [],
            },
            local: {},
        },
    });
    test('createPrincipalDrawGroupTransactionOperation', () => {
        const input = makeEmptyGroupTransactionByType(
            PRINCIPAL_DRAW,
            'principalDraw',
        );
        // @ts-expect-error mock
        input.cashTransaction = positiveMockCashTransaction;
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
        const input = makeEmptyGroupTransactionByType(
            PRINCIPAL_RETURN,
            'principalReturn',
        );
        // @ts-expect-error mock
        input.cashTransaction = negativeMockCashTransaction;
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
        const input = makeEmptyGroupTransactionByType(ASSET_SALE, 'assetSale');
        // @ts-expect-error mock
        input.fixedIncomeTransaction = mockFixedIncomeTransaction;
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
        const input = makeEmptyGroupTransactionByType(
            ASSET_PURCHASE,
            'assetSale',
        );
        // @ts-expect-error mock
        input.fixedIncomeTransaction = mockFixedIncomeTransaction;
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
        const input = makeEmptyGroupTransactionByType(
            INTEREST_DRAW,
            'interestDraw',
        );
        // @ts-expect-error mock
        input.interestTransaction = mockInterestTransaction;
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
        const input = makeEmptyGroupTransactionByType(
            INTEREST_RETURN,
            'interestReturn',
        );
        // @ts-expect-error mock
        input.interestTransaction = mockInterestTransaction;
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
        const existingGroupTransaction = makeEmptyGroupTransactionByType(
            PRINCIPAL_DRAW,
            'principalDraw',
        );
        const input = makeEmptyGroupTransactionByType(
            PRINCIPAL_DRAW,
            'principalDraw',
        );
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
