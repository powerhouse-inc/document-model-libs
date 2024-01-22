/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/transactions/creators';
import { RwaPortfolioDocument } from '../../gen/types';

describe('Transactions Operations', () => {
    let document: RwaPortfolioDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createGroupTransaction operation', () => {
        const input = generateMock(z.CreateGroupTransactionInputSchema());
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
