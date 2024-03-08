/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/general/creators';
import { ArbLtipGranteeDocument } from '../../gen/types';

describe('General Operations', () => {
    let document: ArbLtipGranteeDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle setGrantee operation', () => {
        const input = generateMock(z.SetGranteeInputSchema());
        const updatedDocument = reducer(
            document,
            creators.setGrantee(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'SET_GRANTEE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle setGranteeName operation', () => {
        const input = generateMock(z.SetGranteeNameInputSchema());
        const updatedDocument = reducer(
            document,
            creators.setGranteeName(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'SET_GRANTEE_NAME',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle setGranteeGrantSize operation', () => {
        const input = generateMock(z.SetGranteeGrantSizeInputSchema());
        const updatedDocument = reducer(
            document,
            creators.setGranteeGrantSize(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'SET_GRANTEE_GRANT_SIZE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle setGranteeSummary operation', () => {
        const input = generateMock(z.SetGranteeSummaryInputSchema());
        const updatedDocument = reducer(
            document,
            creators.setGranteeSummary(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'SET_GRANTEE_SUMMARY',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle setGranteeMetrics operation', () => {
        const input = generateMock(z.SetGranteeMetricsInputSchema());
        const updatedDocument = reducer(
            document,
            creators.setGranteeMetrics(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'SET_GRANTEE_METRICS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
