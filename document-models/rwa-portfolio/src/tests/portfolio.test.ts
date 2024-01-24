/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import * as creators from '../../gen/portfolio/creators';
import { reducer } from '../../gen/reducer';
import { RwaAsset, z } from '../../gen/schema';
import { RwaPortfolioDocument } from '../../gen/types';
import utils from '../../gen/utils';

describe('Portfolio Operations', () => {
    let document: RwaPortfolioDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createRwaFixedIncomeAsset operation', () => {
        const input = generateMock(z.CreateRwaFixedIncomeAssetInputSchema());
        const existingFixedIncomeType = generateMock(
            z.RwaFixedIncomeTypeSchema(),
        );
        existingFixedIncomeType.id = input.type;
        const document = utils.createDocument({
            state: {
                global: {
                    fixedIncomeTypes: [existingFixedIncomeType],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.createRwaFixedIncomeAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_RWA_FIXED_INCOME_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle createRwaCashAsset operation', () => {
        const input = generateMock(z.CreateRwaCashAssetInputSchema());
        const updatedDocument = reducer(
            document,
            creators.createRwaCashAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_RWA_CASH_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editRwaFixedIncomeAsset operation', () => {
        const existingAsset = generateMock(
            z.CreateRwaFixedIncomeAssetInputSchema(),
        ) as RwaAsset;
        const input = generateMock(z.EditRwaFixedIncomeAssetInputSchema());
        const existingFixedIncomeType = generateMock(
            z.RwaFixedIncomeTypeSchema(),
        );
        existingAsset.id = input.id;
        // @ts-expect-error mock
        existingFixedIncomeType.id = input.type;
        const document = utils.createDocument({
            state: {
                global: {
                    portfolio: [existingAsset],
                    fixedIncomeTypes: [existingFixedIncomeType],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.editRwaFixedIncomeAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'EDIT_RWA_FIXED_INCOME_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editRwaCashAsset operation', () => {
        const input = generateMock(z.EditRwaCashAssetInputSchema());
        const updatedDocument = reducer(
            document,
            creators.editRwaCashAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'EDIT_RWA_CASH_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteRwaFixedIncomeAsset operation', () => {
        const input = generateMock(z.DeleteRwaFixedIncomeAssetInputSchema());
        const updatedDocument = reducer(
            document,
            creators.deleteRwaFixedIncomeAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_RWA_FIXED_INCOME_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteRwaCashAsset operation', () => {
        const input = generateMock(z.DeleteRwaCashAssetInputSchema());
        const updatedDocument = reducer(
            document,
            creators.deleteRwaCashAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_RWA_CASH_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
