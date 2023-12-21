/**
* This is a scaffold file meant for customization: 
* - change it by adding new tests or modifying the existing ones
*/

import { generateMock } from '@acaldas/powerhouse';

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

    it('should handle addBaseTransaction operation', () => {
        const input = generateMock(z.AddBaseTransactionInputSchema());
        const updatedDocument = reducer(document, creators.addBaseTransaction(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('ADD_BASE_TRANSACTION');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

    it('should handle editTransaction operation', () => {
        const input = generateMock(z.EditTransactionInputSchema());
        const updatedDocument = reducer(document, creators.editTransaction(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('EDIT_TRANSACTION');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

    it('should handle deleteTransaction operation', () => {
        const input = generateMock(z.DeleteTransactionInputSchema());
        const updatedDocument = reducer(document, creators.deleteTransaction(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('DELETE_TRANSACTION');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

});