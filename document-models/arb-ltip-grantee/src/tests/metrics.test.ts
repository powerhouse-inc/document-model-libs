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

    it('should handle initPhase operation', () => {
        const input = generateMock(z.InitPhaseInputSchema());
        input.numberOfPhases = 8;
        input.phaseDuration = 2;
        input.startDate = new Date().toISOString();

        const updatedDocument = reducer(document, creators.initPhase(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('INIT_PHASE');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editPhase operation', () => {
        let updatedDocument = reducer(
            document,
            creators.initPhase({
                startDate: new Date().toISOString(),
                numberOfPhases: 8,
                phaseDuration: 2,
            }),
        );

        const input = generateMock(z.EditPhaseInputSchema());
        input.phaseIndex = 0;
        input.endDate = new Date().toISOString();

        updatedDocument = reducer(updatedDocument, creators.editPhase(input));

        expect(updatedDocument.operations.global).toHaveLength(2);
        expect(updatedDocument.operations.global[1].type).toBe('EDIT_PHASE');
        expect(updatedDocument.operations.global[1].input).toStrictEqual(input);
    });
});
