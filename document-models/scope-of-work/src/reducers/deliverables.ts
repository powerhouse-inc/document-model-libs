/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { Deliverable } from '../../gen';
import { ScopeOfWorkDeliverablesOperations } from '../../gen/deliverables/operations';

export const reducer: ScopeOfWorkDeliverablesOperations = {
    updateDeliverableProgressOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.id,
        );

        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        if (!action.input.workProgress) {
            throw new Error('Work progress is required');
        }

        state.deliverables = state.deliverables.map((d: Deliverable) => {
            if (d.id === action.input.id) {
                return {
                    ...d,
                    workProgress: action.input.workProgress || null,
                };
            }
            return d;
        });
    },
    deleteDeliverableOperation(state, action, dispatch) {
        state.deliverables = state.deliverables.filter(
            (d: Deliverable) => d.id !== action.input.id,
        );
    },
    createDeliverableOperation(state, action, dispatch) {

        const deliverable: Deliverable = {
            id: action.input.id,
            title: action.input.title,
            description: '',
            keyResults: [],
            status: 'IN_PROGRESS',
            workProgress: { value: 0 },
            owner: action.input.owner,
            budgetAnchor: action.input.budgetAnchor,
        };

        state.deliverables.push(deliverable);
    },
    updateDeliverableStatusOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.id,
        );
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        if (!action.input.status) {
            throw new Error('Status is required');
        }
        deliverable.status = action.input.status;
    },
    updateDeliverableDetailsOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.id,
        );
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        if (!action.input.title) {
            throw new Error('Title is required');
        }
        deliverable.title = action.input.title;
        deliverable.description = action.input.description || '';
    },
    addKeyResultToDeliverableOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        deliverable.keyResults.push({
            id: '2',
            title: action.input.title,
            link: action.input.link,
        });

    },
    updateKeyResultOperation(state, action, dispatch) {
        for (const deliverable of state.deliverables) {
            const keyResult = deliverable.keyResults.find(
                kr => kr.id === action.input.keyResultId,
            );
            if (!keyResult) {
                throw new Error('Key result not found');
            }
            keyResult.title = action.input.title || keyResult.title;
            keyResult.link = action.input.link || keyResult.link;
        }
    },
    removeKeyResultFromDeliverableOperation(state, action, dispatch) {
        for (const deliverable of state.deliverables) {
            deliverable.keyResults = deliverable.keyResults.filter(
                kr => kr.id !== action.input.id,
            );
        }
    },
    setDeliverableBudgetOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.deliverableId,
        );

        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        if (action.input.budgetAnchor) {
            deliverable.budgetAnchor = {
                project: action.input.budgetAnchor.project,
                workUnitBudget: action.input.budgetAnchor.workUnitBudget,
                deliverableBudget: action.input.budgetAnchor.deliverableBudget,
            };
        }
    },
};
