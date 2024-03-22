/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { InitGranteeInput, z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/general/creators';
import { ArbLtipGranteeDocument } from '../../gen/types';

describe('General Operations', () => {
    let document: ArbLtipGranteeDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle initGrantee operation', () => {
        const input: InitGranteeInput = {
            disbursementContractAddress:
                '0x1234567890123456789012345678901234567890',
            fundingAddress: '0x1234567890123456789012345678901234567890',
            fundingType: [],
            grantSize: 100,
            grantSummary: 'Summary',
            granteeName: 'Name',
            matchingGrantSize: 10,
            metricsDashboardLink: '',
            numberOfPhases: 1,
            phaseDuration: 1,
            startDate: new Date().toISOString(),
        };
        const updatedDocument = reducer(document, creators.initGrantee(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('INIT_GRANTEE');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editGrantee operation', () => {
        const input = generateMock(z.EditGranteeInputSchema());
        const updatedDocument = reducer(document, creators.editGrantee(input));

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe('EDIT_GRANTEE');
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
