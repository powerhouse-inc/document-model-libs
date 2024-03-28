/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { isDeliverableProgress } from '../..';
import { ScopeOfWorkState } from '../..';
import { ScopeOfWorkDeliverablesOperations } from '../../gen/deliverables/operations';

export const reducer: ScopeOfWorkDeliverablesOperations = {
    createDeliverableOperation(state, action, dispatch) {
        state.deliverables?.push({
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
    updateDeliverableProgressOperation(
        state: ScopeOfWorkState,
        action,
        dispatch,
    ) {
        const { deliverableId, workProgress } = action.input;

        if (!isDeliverableProgress(workProgress)) {
            throw new Error('Invalid workProgress');
        }

        const deliverable = state.deliverables?.find(
            d => d?.id === deliverableId,
        );

        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        deliverable.workProgress = workProgress;
    },
    deleteDeliverableOperation(state, action, dispatch) {
        // throw error if state.deliverables is not defined
        if (!state.deliverables) {
            throw new Error('No deliverables found');
        }
        state.deliverables = state.deliverables.filter(
            d => d?.id !== action.input.deliverableId,
        );
    },
    updateDeliverableStatusOperation(state, action, dispatch) {
        const deliverable = state.deliverables?.find(
            d => d?.id === action.input.deliverableId,
        );

        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        deliverable.status = action.input.status;
    },
    updateDeliverableDetailsOperation(state, action, dispatch) {
        const deliverable = state.deliverables?.find(
            d => d?.id === action.input.deliverableId,
        );

        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        if (action.input.title !== undefined && action.input.title !== null) {
            deliverable.title = action.input.title;
        }
        if (action.input.description !== undefined) {
            deliverable.description = action.input.description;
        }
    },
    addKeyResultToDeliverableOperation(state, action, dispatch) {
        const { deliverableId, id, title, link } = action.input;

        const deliverable = state.deliverables?.find(
            d => d?.id === deliverableId,
        );

        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        deliverable.keyResults.push({ id, title, link });
    },
    updateKeyResultOperation(state, action, dispatch) {
        const { keyResultId, title, link } = action.input;

        if (!state.deliverables) {
            throw new Error('No deliverables found');
        }
        for (const deliverable of state.deliverables) {
            const keyResult = deliverable?.keyResults.find(
                kr => kr.id === keyResultId,
            );

            if (keyResult) {
                if (title !== undefined) {
                    keyResult.title = title;
                }
                if (link !== undefined && link !== null) {
                    keyResult.link = link;
                }
                return;
            }
        }

        throw new Error('Key result not found');
    },
    removeKeyResultFromDeliverableOperation(state, action, dispatch) {
        const { deliverableId, keyResultId } = action.input;

        if (!state.deliverables) {
            throw new Error('No deliverables found');
        }
        for (const deliverable of state.deliverables) {
            if (deliverable?.id === deliverableId) {
                deliverable.keyResults = deliverable.keyResults.filter(
                    kr => kr.id !== keyResultId,
                );
                return;
            } else {
                throw new Error(`KeyResult id: ${keyResultId} not found`);
            }
        }
    },
    setDeliverableBudgetOperation(state, action, dispatch) {
        const { deliverableId, workUnitBudget, deliverableBudget } =
            action.input;

        const deliverable = state.deliverables?.find(
            d => d?.id === deliverableId,
        );

        if (!deliverable) {
            throw new Error('Deliverable not found');
        }

        deliverable.workUnitBudget = workUnitBudget;
        deliverable.deliverableBudget = deliverableBudget;
    },
};
