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
        document.state.global.phases = [
            {
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                actuals: null,
                planned: null,
                stats: null,
                status: 'NotStarted',
            },
        ];
    });

    it('should handle editPhase operation', () => {
        const input = generateMock(z.EditPhaseInputSchema());
        input.phaseIndex = 0;

        const updatedDocument = reducer(document, creators.editPhase(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('EDIT_PHASE');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    });
});
