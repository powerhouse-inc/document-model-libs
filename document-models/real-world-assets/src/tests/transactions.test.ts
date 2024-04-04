/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';
import { addDays } from 'date-fns';
import { reducer } from '../../gen/reducer';
import { z } from '../../gen/schema';
import * as creators from '../../gen/transactions/creators';
import utils from '../../gen/utils';
import {
    ASSET_PURCHASE,
    ASSET_SALE,
    INTEREST_PAYMENT,
    PRINCIPAL_DRAW,
    PRINCIPAL_RETURN,
} from '../constants';
import { makeEmptyGroupTransactionByType } from '../utils';
const principalLenderAccount = generateMock(z.AccountSchema());
const mockAccount = generateMock(z.AccountSchema());
const mockCounterParty = generateMock(z.AccountSchema());
const mockCashAsset = generateMock(z.CashSchema());
const mockFixedIncomeAsset = generateMock(z.FixedIncomeSchema());
mockFixedIncomeAsset.maturity = addDays(new Date(), 30).toDateString();
const mockServiceProvider = generateMock(z.ServiceProviderFeeTypeSchema());
mockServiceProvider.accountId = mockCounterParty.id;
const mockCashTransaction = generateMock(z.BaseTransactionSchema());
mockCashTransaction.counterPartyAccountId = principalLenderAccount.id;
mockCashTransaction.assetId = mockCashAsset.id;
const positiveMockCashTransaction = {
    ...mockCashTransaction,
    accountId: mockAccount.id,
    amount: 100,
};
const negativeMockCashTransaction = {
    ...mockCashTransaction,
    accountId: mockAccount.id,
    amount: -100,
};
const mockFixedIncomeTransaction = generateMock(z.BaseTransactionSchema());
mockFixedIncomeTransaction.assetId = mockFixedIncomeAsset.id;
const mockInterestTransaction = generateMock(z.BaseTransactionSchema());
mockInterestTransaction.assetId = mockFixedIncomeAsset.id;
mockInterestTransaction.counterPartyAccountId = mockServiceProvider.accountId;
mockInterestTransaction.accountId = mockAccount.id;

describe('Transactions Operations', () => {
    const document = utils.createDocument({
        state: {
            global: {
                accounts: [
                    principalLenderAccount,
                    mockCounterParty,
                    mockAccount,
                ],
                principalLenderAccountId: principalLenderAccount.id,
                spvs: [],
                serviceProviderFeeTypes: [mockServiceProvider],
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
            creators.createGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_GROUP_TRANSACTION',
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
            creators.createGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    test.skip('createAssetSaleGroupTransactionOperation', () => {
        const input = makeEmptyGroupTransactionByType(ASSET_SALE, 'assetSale');
        // @ts-expect-error mock
        input.fixedIncomeTransaction = mockFixedIncomeTransaction;
        const updatedDocument = reducer(
            document,
            creators.createGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    test.skip('createAssetPurchaseGroupTransactionOperation', () => {
        const input = makeEmptyGroupTransactionByType(
            ASSET_PURCHASE,
            'assetSale',
        );
        // @ts-expect-error mock
        input.fixedIncomeTransaction = mockFixedIncomeTransaction;
        const updatedDocument = reducer(
            document,
            creators.createGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_GROUP_TRANSACTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    test('createInterestPaymentGroupTransactionOperation', () => {
        const input = makeEmptyGroupTransactionByType(
            INTEREST_PAYMENT,
            'interestPayment',
        );
        // @ts-expect-error mock
        input.cashTransaction = positiveMockCashTransaction;
        const updatedDocument = reducer(
            document,
            creators.createGroupTransaction(input),
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_GROUP_TRANSACTION',
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
                    // @ts-expect-error mock
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
