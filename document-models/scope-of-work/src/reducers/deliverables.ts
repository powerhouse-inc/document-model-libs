/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { Deliverable } from '../../gen';
import { ScopeOfWorkDeliverablesOperations } from '../../gen/deliverables/operations';

export const reducer: ScopeOfWorkDeliverablesOperations = {
    createDeliverableOperation(state, action, dispatch) {
        const deliverable: Deliverable = {
            id: action.input.id,
            title: action.input.title || '',
            description: '',
            keyResults: action.input.keyResults || [],
            status: action.input.status || 'DRAFT',
            workProgress: action.input.workProgress || null,
            owner: action.input.owner || null,
            budgetAnchor: action.input.budgetAnchor || null,
        };

        state.deliverables.push(deliverable);
    },
    deleteDeliverableOperation(state, action, dispatch) {
        state.deliverables = state.deliverables.filter(
            (d: Deliverable) => d.id !== action.input.id,
        );
    },
    updateDeliverableDetailsOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.id,
        );
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        deliverable.title = action.input.title || '';
        deliverable.description = action.input.description || '';
        deliverable.owner = action.input.owner || deliverable.owner;

        if (action.input.removeDescription) {
            deliverable.description = '';
        }
        if (action.input.removeOwner) {
            deliverable.owner = null;
        }
    },
    updateDeliverableStatusOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.id,
        );
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }
        deliverable.status = action.input.status;
    },

    addKeyResultToDeliverableOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        deliverable.keyResults.push({
            id: action.input.id,
            title: action.input.title || '',
            link: action.input.link || '',
        });
    },
    updateKeyResultOperation(state, action, dispatch) {
        for (const deliverable of state.deliverables) {
            const keyResult = deliverable.keyResults.find(
                kr => kr.id === action.input.id,
            );
            if (!keyResult) {
                throw new Error('Key result not found');
            }
            keyResult.title = action.input.title || keyResult.title;
            keyResult.link = action.input.link || keyResult.link;

            if (action.input.removeLink) {
                keyResult.link = '';
            }
        }
    },
    moveKeyResultOperation(state, action, dispatch) {
        for (const deliverable of state.deliverables) {
            const keyResult = deliverable.keyResults.find(
                kr => kr.id === action.input.id,
            );
            if (!keyResult) {
                throw new Error('Key result not found');
            }
            deliverable.keyResults = deliverable.keyResults.filter(
                kr => kr.id !== action.input.id,
            );
            const targetDeliverable = state.deliverables.find(
                d => d.id === action.input.deliverableId,
            );
            if (!targetDeliverable) {
                throw new Error('Target deliverable not found');
            }
            targetDeliverable.keyResults.push(keyResult);
        }
    },
    removeKeyResultFromDeliverableOperation(state, action, dispatch) {
        for (const deliverable of state.deliverables) {
            const keyResult = deliverable.keyResults.find(
                kr => kr.id === action.input.id,
            );
            if (!keyResult) {
                throw new Error('Key result not found');
            }
            deliverable.keyResults = deliverable.keyResults.filter(
                kr => kr.id !== action.input.id,
            );
        }
    },
    updateDeliverableProgressOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.id,
        );
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }
        deliverable.workProgress = action.input.workProgress || null;
    },
    setDeliverableBudgetAnchorOperation(state, action, dispatch) {
        const deliverable = state.deliverables.find(
            (d: Deliverable) => d.id === action.input.id,
        );
        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        // check if deliverable.budgetAnchor is null
        if (!deliverable.budgetAnchor) {
            deliverable.budgetAnchor = {
                project: '',
                workUnitBudget: 0,
                deliverableBudget: 0,
            };
        }
        deliverable.budgetAnchor.project = action.input.project;
        deliverable.budgetAnchor.workUnitBudget = action.input.workUnitBudget || 0;
    },
};
