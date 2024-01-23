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

describe('Transactions Operations', () => {
    let document: RwaPortfolioDocument;

    beforeEach(() => {
        document = utils.createDocument();
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
