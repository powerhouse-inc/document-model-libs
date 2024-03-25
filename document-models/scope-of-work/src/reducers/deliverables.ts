/**
 * This is a scaffold file meant for customization: 
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { ScopeOfWorkDeliverablesOperations } from '../../gen/deliverables/operations';

export const reducer: ScopeOfWorkDeliverablesOperations = {
    createDeliverableOperation(state, action, dispatch) {
        state.deliverables?.push({
            id: action.input.id as string,
            title: action.input.title,
            status: 'TODO',
            owner: null,
            workUnitBudget: 1,
            workProgress: null,
            deliverableBudget: 0,
            description: null,
            keyResults: [],
        });
    },
    updateDeliverableProgressOperation(state, action, dispatch) {
        // TODO: Implement "updateDeliverableProgressOperation" reducer
        throw new Error('Reducer "updateDeliverableProgressOperation" not yet implemented');
    },
    deleteDeliverableOperation(state, action, dispatch) {
        // TODO: Implement "deleteDeliverableOperation" reducer
        throw new Error('Reducer "deleteDeliverableOperation" not yet implemented');
    },
    updateDeliverableStatusOperation(state, action, dispatch) {
        // TODO: Implement "updateDeliverableStatusOperation" reducer
        throw new Error('Reducer "updateDeliverableStatusOperation" not yet implemented');
    },
    updateDeliverableDetailsOperation(state, action, dispatch) {
        // TODO: Implement "updateDeliverableDetailsOperation" reducer
        throw new Error('Reducer "updateDeliverableDetailsOperation" not yet implemented');
    },
    addKeyResultToDeliverableOperation(state, action, dispatch) {
        // TODO: Implement "addKeyResultToDeliverableOperation" reducer
        throw new Error('Reducer "addKeyResultToDeliverableOperation" not yet implemented');
    },
    updateKeyResultOperation(state, action, dispatch) {
        // TODO: Implement "updateKeyResultOperation" reducer
        throw new Error('Reducer "updateKeyResultOperation" not yet implemented');
    },
    removeKeyResultFromDeliverableOperation(state, action, dispatch) {
        // TODO: Implement "removeKeyResultFromDeliverableOperation" reducer
        throw new Error('Reducer "removeKeyResultFromDeliverableOperation" not yet implemented');
    },
    setDeliverableBudgetOperation(state, action, dispatch) {
        // TODO: Implement "setDeliverableBudgetOperation" reducer
        throw new Error('Reducer "setDeliverableBudgetOperation" not yet implemented');
    },
}