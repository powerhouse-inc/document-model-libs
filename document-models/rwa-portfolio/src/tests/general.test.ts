/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import * as creators from '../../gen/general/creators';
import { reducer } from '../../gen/reducer';
import { z } from '../../gen/schema';
import { RwaPortfolioDocument } from '../../gen/types';
import utils from '../../gen/utils';

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
        const initialInput = generateMock(z.CreateSpvInputSchema());
        const newInput = generateMock(z.EditSpvInputSchema());
        newInput.id = initialInput.id;
        const document = utils.createDocument({
            state: {
                global: {
                    spvs: [initialInput],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(document, creators.editSpv(newInput));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('EDIT_SPV');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(
            newInput,
        );
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteSpv operation', () => {
        const initialInput = generateMock(z.CreateSpvInputSchema());
        const deleteInput = generateMock(z.DeleteSpvInputSchema());
        deleteInput.id = initialInput.id;
        const document = utils.createDocument({
            state: {
                global: {
                    spvs: [initialInput],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.deleteSpv(deleteInput),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('DELETE_SPV');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(
            deleteInput,
        );
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle createServiceProvider operation', () => {
        const input = generateMock(z.CreateServiceProviderInputSchema());
        const updatedDocument = reducer(
            document,
            creators.createServiceProvider(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_SERVICE_PROVIDER',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editServiceProvider operation', () => {
        const initialInput = generateMock(z.CreateServiceProviderInputSchema());
        const newInput = generateMock(z.EditServiceProviderInputSchema());
        newInput.id = initialInput.id;
        const document = utils.createDocument({
            state: {
                global: {
                    feeTypes: [initialInput],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.editServiceProvider(newInput),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'EDIT_SERVICE_PROVIDER',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(
            newInput,
        );
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteServiceProvider operation', () => {
        const initialInput = generateMock(z.CreateServiceProviderInputSchema());
        const deleteInput = generateMock(z.DeleteServiceProviderInputSchema());
        deleteInput.id = initialInput.id;
        const document = utils.createDocument({
            state: {
                global: {
                    feeTypes: [initialInput],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.deleteServiceProvider(deleteInput),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_SERVICE_PROVIDER',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(
            deleteInput,
        );
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
