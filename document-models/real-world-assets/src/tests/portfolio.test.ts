/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import * as creators from '../../gen/portfolio/creators';
import { reducer } from '../../gen/reducer';
import { Asset, z } from '../../gen/schema';
import { RealWorldAssetsDocument } from '../../gen/types';
import utils from '../../gen/utils';

describe('Portfolio Operations', () => {
    let document: RealWorldAssetsDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createFixedIncomeAsset operation', () => {
        const input = generateMock(z.CreateFixedIncomeAssetInputSchema());
        const existingFixedIncomeType = generateMock(z.FixedIncomeTypeSchema());
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
            creators.createFixedIncomeAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_FIXED_INCOME_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle createCashAsset operation', () => {
        const input = generateMock(z.CreateCashAssetInputSchema());
        input.currency = 'USD';
        const existingSpv = generateMock(z.SpvSchema());
        existingSpv.id = input.spv;
        const document = utils.createDocument({
            state: {
                global: {
                    spvs: [existingSpv],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.createCashAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_CASH_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editFixedIncomeAsset operation', () => {
        const existingAsset = generateMock(
            z.CreateFixedIncomeAssetInputSchema(),
        ) as Asset;
        const input = generateMock(z.EditFixedIncomeAssetInputSchema());
        const existingFixedIncomeType = generateMock(z.FixedIncomeTypeSchema());
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
            creators.editFixedIncomeAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'EDIT_FIXED_INCOME_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editCashAsset operation', () => {
        const input = generateMock(z.EditCashAssetInputSchema());
        input.currency = 'USD';
        const existingSpv = generateMock(z.SpvSchema());
        // @ts-expect-error mock
        existingSpv.id = input.spv;
        const existingAsset = generateMock(z.CreateCashAssetInputSchema());
        existingAsset.id = input.id;
        const document = utils.createDocument({
            state: {
                global: {
                    portfolio: [existingAsset],
                    spvs: [existingSpv],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.editCashAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'EDIT_CASH_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteFixedIncomeAsset operation', () => {
        const input = generateMock(z.DeleteFixedIncomeAssetInputSchema());
        const existingAsset = generateMock(
            z.CreateFixedIncomeAssetInputSchema(),
        );
        existingAsset.id = input.id;
        const document = utils.createDocument({
            state: {
                global: {
                    // @ts-expect-error mock
                    portfolio: [existingAsset],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.deleteFixedIncomeAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_FIXED_INCOME_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteCashAsset operation', () => {
        const input = generateMock(z.DeleteCashAssetInputSchema());
        const existingAsset = generateMock(z.CreateCashAssetInputSchema());
        existingAsset.id = input.id;
        const document = utils.createDocument({
            state: {
                global: {
                    portfolio: [existingAsset],
                },
                local: {},
            },
        });
        const updatedDocument = reducer(
            document,
            creators.deleteCashAsset(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_CASH_ASSET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});