/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import utils from '../../gen/utils';
import {
    AddKeyResultToDeliverableInput,
    CreateDeliverableInput,
    DeleteDeliverableInput,
    RemoveKeyResultFromDeliverableInput,
    SetDeliverableBudgetInput,
    UpdateDeliverableDetailsInput,
    UpdateDeliverableProgressInput,
    UpdateDeliverableStatusInput,
    UpdateKeyResultInput,
} from '../../gen/schema';
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
        document = reducer(
            document,
            creators.createDeliverable({
                id: generateId(),
                title: 'Initial state deliverable',
            }),
        );
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

        expect(updatedDocument.state.global.deliverables[1].id).toEqual(
            input.id,
        );
        expect(updatedDocument.operations.global).toHaveLength(2);
        expect(updatedDocument.operations.global[1].type).toBe(
            'CREATE_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[1].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[1].index).toEqual(1);
    });
    it('should handle updateDeliverableProgress operation', () => {
        const input: UpdateDeliverableProgressInput = {
            deliverableId: document.state.global.deliverables[0].id,
            workProgress: {
                completed: 1,
                total: 1,
            },
        };
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableProgress(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(2);
        expect(updatedDocument.operations.global[1].type).toBe(
            'UPDATE_DELIVERABLE_PROGRESS',
        );
        expect(updatedDocument.operations.global[1].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[1].index).toEqual(1);
    });
    it('should handle deleteDeliverable operation', () => {
        const input: DeleteDeliverableInput = {
            deliverableId: document.state.global.deliverables[0].id,
        };
        const updatedDocument = reducer(
            document,
            creators.deleteDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(2);
        expect(updatedDocument.operations.global[1].type).toBe(
            'DELETE_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[1].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[1].index).toEqual(1);
    });
    it('should handle updateDeliverableStatus operation', () => {
        const input: UpdateDeliverableStatusInput = {
            deliverableId: document.state.global.deliverables[0].id,
            status: 'TODO',
        };
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableStatus(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(2);
        expect(updatedDocument.operations.global[1].type).toBe(
            'UPDATE_DELIVERABLE_STATUS',
        );
        expect(updatedDocument.operations.global[1].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[1].index).toEqual(1);
    });
    it('should handle updateDeliverableDetails operation', () => {
        const input: UpdateDeliverableDetailsInput = {
            deliverableId: document.state.global.deliverables[0].id,
            title: 'New title',
            description: 'New description',
        };
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableDetails(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(2);
        expect(updatedDocument.operations.global[1].type).toBe(
            'UPDATE_DELIVERABLE_DETAILS',
        );
        expect(updatedDocument.operations.global[1].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[1].index).toEqual(1);
    });
    it('should handle addKeyResultToDeliverable operation', () => {
        const input: AddKeyResultToDeliverableInput = {
            deliverableId: document.state.global.deliverables[0].id,
            id: generateId(),
            title: 'My key result',
            link: 'My key result link',
        };
        const updatedDocument = reducer(
            document,
            creators.addKeyResultToDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(2);
        expect(updatedDocument.operations.global[1].type).toBe(
            'ADD_KEY_RESULT_TO_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[1].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[1].index).toEqual(1);
    });
    it('should handle updateKeyResult operation', () => {
        // key result input
        const KeyResultInput: AddKeyResultToDeliverableInput = {
            deliverableId: document.state.global.deliverables[0].id,
            id: generateId(),
            title: 'My key result',
            link: 'My key result link',
        };

        const input: UpdateKeyResultInput = {
            keyResultId: KeyResultInput.id,
            title: 'My updated key result',
            link: 'My updated key result link',
        };
        const KeyResultDocument = reducer(
            document,
            creators.addKeyResultToDeliverable(KeyResultInput),
        );
        const updatedDocument = reducer(
            KeyResultDocument,
            creators.updateKeyResult(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(3);
        expect(updatedDocument.operations.global[2].type).toBe(
            'UPDATE_KEY_RESULT',
        );
        expect(updatedDocument.operations.global[2].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[2].index).toEqual(2);
    });
    it('should handle removeKeyResultFromDeliverable operation', () => {
        // key result input
        const KeyResultInput: AddKeyResultToDeliverableInput = {
            deliverableId: document.state.global.deliverables[0].id,
            id: generateId(),
            title: 'My key result',
            link: 'My key result link',
        };

        const KeyResultDocument = reducer(
            document,
            creators.addKeyResultToDeliverable(KeyResultInput),
        );

        const input: RemoveKeyResultFromDeliverableInput = {
            deliverableId: document.state.global.deliverables[0].id,
            keyResultId: KeyResultInput.id,
        };
        const updatedDocument = reducer(
            KeyResultDocument,
            creators.removeKeyResultFromDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(3);
        expect(updatedDocument.operations.global[2].type).toBe(
            'REMOVE_KEY_RESULT_FROM_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[2].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[2].index).toEqual(2);
    });
    it('should handle setDeliverableBudget operation', () => {
        const input: SetDeliverableBudgetInput = {
            deliverableId: document.state.global.deliverables[0].id,
            workUnitBudget: 1000,
            deliverableBudget: 1000,
        };
        const updatedDocument = reducer(
            document,
            creators.setDeliverableBudget(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(2);
        expect(updatedDocument.operations.global[1].type).toBe(
            'SET_DELIVERABLE_BUDGET',
        );
        expect(updatedDocument.operations.global[1].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[1].index).toEqual(1);
    });
});
