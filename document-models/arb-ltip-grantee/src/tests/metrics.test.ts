/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/metrics/creators';
import { ArbLtipGranteeDocument } from '../../gen/types';

describe('Metrics Operations', () => {
    let document: ArbLtipGranteeDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle addActuals operation', () => {
        const input = generateMock(z.AddActualsInputSchema());
        const updatedDocument = reducer(
            document,
            creators.addActuals(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_ACTUALS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle addPlanned operation', () => {
        const input = generateMock(z.AddPlannedInputSchema());
        const updatedDocument = reducer(
            document,
            creators.addPlanned(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_PLANNED',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle addStats operation', () => {
        const input = generateMock(z.AddStatsInputSchema());
        const updatedDocument = reducer(
            document,
            creators.addStats(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_STATS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
