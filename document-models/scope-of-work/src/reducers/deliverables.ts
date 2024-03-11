/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { isProgress, isDeliverableStatus, generateId } from '../utils';
import {
    KeyResult,
    Deliverable,
    CreateDeliverableInput,
    KeyResultInput,
} from '../../gen/schema/types';
import { ScopeOfWorkDeliverablesOperations } from '../../gen/deliverables/operations';

export const reducer: ScopeOfWorkDeliverablesOperations = {
    updateDeliverableProgressOperation(state, action, dispatch) {
        if (!isProgress(action.input.workProgress)) {
            throw new Error(
                `InvalidProgressValue: workProgress must be an instance of Progress`,
            );
        }
        const deliverable = state.deliverables?.find(
            deliverable => deliverable?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        deliverable.workProgress = action.input.workProgress;
    },
    deleteDeliverableOperation(state, action, dispatch) {
        const deliverableIndex: number | undefined =
            state.deliverables?.findIndex(
                deliverable => deliverable?.id === action.input.deliverableId,
            );
        if (deliverableIndex === -1) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        if (typeof deliverableIndex === 'number') {
            state.deliverables?.splice(deliverableIndex, 1);
        }
    },
    createDeliverableOperation(state, action, dispatch) {
        const deliverable: CreateDeliverableInput = action.input;
        if (!deliverable.title) {
            throw new Error(`Deliverable must have a title`);
        }
        if (!isProgress(deliverable.workProgress)) {
            throw new Error(
                `InvalidProgressValue: Deliverable's workProgress must be an instance of Progress`,
            );
        }
        if (typeof deliverable.workUnitBudget !== 'number') {
            throw new Error(`Deliverable must have a workUnitBudget`);
        }
        if (typeof deliverable.deliverableBudget !== 'number') {
            throw new Error(
                `InvalidBudgetValue: Deliverable must have a deliverableBudget`,
            );
        }
        if (!deliverable.description) {
            throw new Error(`Deliverable must have a description`);
        }
        if (
            !Array.isArray(deliverable.keyResults) ||
            deliverable.keyResults.some(
                (kr: KeyResultInput) => typeof kr !== 'object',
            )
        ) {
            throw new Error(
                `Deliverable's keyResults must be an array of KeyResultInput objects`,
            );
        }

        // find the project from action.input.project
        const project = state.projects?.find(
            project => project?.id === deliverable.project,
        );
        if (!project) {
            throw new Error(`ProjectNotFound: Deliverable must have a project`);
        }

        // add ids to each deliverable, and keyResult
        const fullDeliverable: Deliverable = {
            ...deliverable,
            project: project,
            id: generateId(state.deliverables || []),
            keyResults: deliverable.keyResults.map((kr: KeyResultInput) => ({
                ...kr,
                id: generateId(deliverable.keyResults as KeyResult[]),
            })),
        };

        state.deliverables?.push(fullDeliverable);
    },
    updateDeliverableStatusOperation(state, action, dispatch) {
        if (!isDeliverableStatus(action.input.status)) {
            throw new Error(
                `InvalidStatusValue: status must be a valid DeliverableStatus`,
            );
        }
        const deliverable = state.deliverables?.find(
            deliverable => deliverable?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        deliverable.status = action.input.status;
    },
    updateDeliverableDetailsOperation(state, action, dispatch) {
        if (!action.input.deliverableId) {
            throw new Error(`InvalidInput: Deliverable must have an id`);
        }
        const deliverable = state.deliverables?.find(
            deliverable => deliverable?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        if (action.input.title !== undefined && action.input.title !== null) {
            deliverable.title = action.input.title;
        }
        if (
            action.input.description !== undefined &&
            action.input.description !== null
        ) {
            deliverable.description = action.input.description;
        }
    },
    addKeyResultToDeliverableOperation(state, action, dispatch) {
        if (!action.input.deliverableId) {
            throw new Error(`Deliverable must have an id`);
        }
        if (!action.input.title) {
            throw new Error(
                `InvalidKeyResultData: Key result must have a title`,
            );
        }
        if (!action.input.link) {
            throw new Error(
                `InvalidKeyResultData: Key result must have a link`,
            );
        }
        const deliverable = state.deliverables?.find(
            deliverable => deliverable?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        const keyResult: KeyResult = {
            deliverable: action.input.deliverableId,
            id: generateId(deliverable.keyResults),
            title: action.input.title,
            link: action.input.link,
        };
        deliverable.keyResults.push(keyResult);
    },
    updateKeyResultOperation(state, action, dispatch) {
        if (!action.input.keyResultId) {
            throw new Error(`Key result must have an id`);
        }
        const deliverable = state.deliverables?.find(deliverable =>
            deliverable?.keyResults.some(
                keyResult => keyResult.id === action.input.keyResultId,
            ),
        );
        if (!deliverable) {
            throw new Error(
                `KeyResultNotFound: Key result with id ${action.input.keyResultId} does not exist!`,
            );
        }
        const keyResult = deliverable.keyResults.find(
            keyResult => keyResult.id === action.input.keyResultId,
        );
        if (!keyResult) {
            throw new Error(
                `KeyResultNotFound: Key result with id ${action.input.keyResultId} does not exist!`,
            );
        }
        if (action.input.title !== undefined && action.input.title !== null) {
            keyResult.title = action.input.title;
        }
        if (action.input.link !== undefined && action.input.link !== null) {
            keyResult.link = action.input.link;
        }
    },
    removeKeyResultFromDeliverableOperation(state, action, dispatch) {
        const deliverable = state.deliverables?.find(
            deliverable => deliverable?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        const keyResultIndex = deliverable.keyResults.findIndex(
            keyResult => keyResult.id === action.input.keyResultId,
        );
        if (keyResultIndex === -1) {
            throw new Error(
                `KeyResultNotFound: Key result with id ${action.input.keyResultId} does not exist!`,
            );
        }
        deliverable.keyResults.splice(keyResultIndex, 1);
    },
    setDeliverableBudgetOperation(state, action, dispatch) {
        const deliverable = state.deliverables?.find(
            deliverable => deliverable?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        deliverable.deliverableBudget = action.input.deliverableBudget;
    },
    addDeliverableToMilestoneOperation(state, action, dispatch) {
        if (!action.input.deliverableId) {
            throw new Error(`InvalidOperation: Deliverable must have an id`);
        }
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const deliverable = state.deliverables?.find(
            deliverable => deliverable?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `MilestoneNotFound: Milestone with id ${action.input.milestoneId} does not exist!`,
            );
        }
        if (!milestone.deliverables) {
            milestone.deliverables = [];
        }
        milestone.deliverables.push(deliverable);
    },
    removeDeliverableFromMilestoneOperation(state, action, dispatch) {
        if (!action.input.deliverableId) {
            throw new Error(`InvalidOperation: Deliverable must have an id`);
        }
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `MilestoneNotFound: Milestone with id ${action.input.milestoneId} does not exist!`,
            );
        }
        const deliverableIndex = milestone.deliverables?.findIndex(
            deliverable => deliverable.id === action.input.deliverableId,
        );
        if (deliverableIndex === -1) {
            throw new Error(
                `DeliverableNotFound: Deliverable with id ${action.input.deliverableId} does not exist!`,
            );
        }
        if (typeof deliverableIndex === 'number') {
            milestone.deliverables?.splice(deliverableIndex, 1);
        }
    },
};
