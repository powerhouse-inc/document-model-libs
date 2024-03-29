/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { CreateDeliverableInput, z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/deliverables/creators';
import { ScopeOfWorkDocument } from '../../gen/types';

function generateId(): string {
    return (Math.random() + 1).toString(36).substring(7);
}

describe('Deliverables Operations', () => {
    let document: ScopeOfWorkDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createDeliverable operation', () => {
        const input: CreateDeliverableInput = {
            id: generateId(),
            title: 'My new deliverable',
        };

        const updatedDocument = reducer(
            document,
            creators.createDeliverable(input),
        );

        expect(updatedDocument.state.global.deliverables[0].id).toEqual(
            input.id,
        );
        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateDeliverableProgress operation', () => {
        const input = generateMock(z.UpdateDeliverableProgressInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableProgress(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_DELIVERABLE_PROGRESS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteDeliverable operation', () => {
        const input = generateMock(z.DeleteDeliverableInputSchema());
        const updatedDocument = reducer(
            document,
            creators.deleteDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateDeliverableStatus operation', () => {
        const input = generateMock(z.UpdateDeliverableStatusInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableStatus(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_DELIVERABLE_STATUS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateDeliverableDetails operation', () => {
        const input = generateMock(z.UpdateDeliverableDetailsInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableDetails(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_DELIVERABLE_DETAILS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle addKeyResultToDeliverable operation', () => {
        const input = generateMock(z.AddKeyResultToDeliverableInputSchema());
        const updatedDocument = reducer(
            document,
            creators.addKeyResultToDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_KEY_RESULT_TO_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateKeyResult operation', () => {
        const input = generateMock(z.UpdateKeyResultInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateKeyResult(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_KEY_RESULT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle removeKeyResultFromDeliverable operation', () => {
        const input = generateMock(z.RemoveKeyResultFromDeliverableInputSchema());
        const updatedDocument = reducer(
            document,
            creators.removeKeyResultFromDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'REMOVE_KEY_RESULT_FROM_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle setDeliverableBudget operation', () => {
        const input = generateMock(z.SetDeliverableBudgetInputSchema());
        const updatedDocument = reducer(
            document,
            creators.setDeliverableBudget(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'SET_DELIVERABLE_BUDGET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
