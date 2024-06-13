/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/metrics/creators';
import { ArbitrumLtipGranteeDocument } from '../../gen/types';
import { createContext, expectNoException, signer } from '../utils';

describe('Metrics Operations', () => {
    let document: ArbitrumLtipGranteeDocument;

    beforeEach(() => {
        document = utils.createDocument();
        document.state.global.authorizedSignerAddress = signer;
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
        input.planned = null;

        const action = creators.editPhase(input);
        action.context = createContext();

        const updatedDocument = reducer(document, action);

        expectNoException(updatedDocument);
    });
});
