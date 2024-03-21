/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { ScopeOfWorkDeliverablesOperations } from '../../gen/deliverables/operations';

export const reducer: ScopeOfWorkDeliverablesOperations = {
    createDeliverableOperation(state, action, dispatch) {
        state.deliverables.push({
            id: action.input.id,
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
};
