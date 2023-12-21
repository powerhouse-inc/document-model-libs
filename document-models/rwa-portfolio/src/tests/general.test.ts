/**
* This is a scaffold file meant for customization: 
* - change it by adding new tests or modifying the existing ones
*/

import { generateMock } from '@acaldas/powerhouse';

import utils from '../../gen/utils';
import { z } from '../../gen/schema'; 
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/general/creators';
import { RwaPortfolioDocument } from '../../gen/types';


describe('General Operations', () => {
    let document: RwaPortfolioDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createSpv operation', () => {
        const input = generateMock(z.CreateSpvInputSchema());
        const updatedDocument = reducer(document, creators.createSpv(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('CREATE_SPV');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

    it('should handle editSpv operation', () => {
        const input = generateMock(z.EditSpvInputSchema());
        const updatedDocument = reducer(document, creators.editSpv(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('EDIT_SPV');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

    it('should handle deleteSpv operation', () => {
        const input = generateMock(z.DeleteSpvInputSchema());
        const updatedDocument = reducer(document, creators.deleteSpv(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('DELETE_SPV');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

    it('should handle addServiceProvider operation', () => {
        const input = generateMock(z.AddServiceProviderInputSchema());
        const updatedDocument = reducer(document, creators.addServiceProvider(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('ADD_SERVICE_PROVIDER');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

    it('should handle editServiceProvider operation', () => {
        const input = generateMock(z.EditServiceProviderInputSchema());
        const updatedDocument = reducer(document, creators.editServiceProvider(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('EDIT_SERVICE_PROVIDER');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

    it('should handle deleteServiceProvider operation', () => {
        const input = generateMock(z.DeleteServiceProviderInputSchema());
        const updatedDocument = reducer(document, creators.deleteServiceProvider(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('DELETE_SERVICE_PROVIDER');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

});