/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { generateId } from '../utils';
import { Roadmap } from '../..';
import { ScopeOfWorkRoadmapsOperations } from '../../gen/roadmaps/operations';

export const reducer: ScopeOfWorkRoadmapsOperations = {
    createRoadmapOperation(state, action, dispatch) {
        if (!action.input.slug) {
            throw new Error('InvalidInputData: Slug must be provided');
        }

        const roadmapExists = state.roadmaps?.some(
            roadmap => roadmap?.slug === action.input.slug,
        );

        if (roadmapExists) {
            throw new Error(
                'DuplicateSlug: The specified slug for the roadmap is already in use',
            );
        }

        if (!action.input.title) {
            throw new Error('InvalidInputData: Title must be provided');
        }

        if (!action.input.description) {
            throw new Error('InvalidInputData: Description must be provided');
        }

        const newRoadmap = {
            id: generateId(state.roadmaps as Roadmap[]),
            slug: action.input.slug,
            title: action.input.title,
            description: action.input.description,
            milestones: [],
        };

        state.roadmaps?.push(newRoadmap);
    },
    updateRoadmapDescriptionOperation(state, action, dispatch) {
        if (!action.input.roadmapId) {
            throw new Error('InvalidOperation: No roadmap id');
        }

        const roadmapIndex = state.roadmaps?.findIndex(
            roadmap => roadmap?.id === action.input.roadmapId,
        );
        if (roadmapIndex === -1 || roadmapIndex === undefined) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        const roadmap = state.roadmaps ? state.roadmaps[roadmapIndex] : null;

        if (!roadmap) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        roadmap.description = action.input.description;
    },
    deleteRoadmapOperation(state, action, dispatch) {
        if (!action.input.roadmapId) {
            throw new Error('InvalidOperation: No roadmap id');
        }

        const roadmapIndex = state.roadmaps?.findIndex(
            roadmap => roadmap?.id === action.input.roadmapId,
        );
        if (roadmapIndex === -1 || roadmapIndex === undefined) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        state.roadmaps?.splice(roadmapIndex, 1);
    },
    updateRoadmapTitleOperation(state, action, dispatch) {
        if (!action.input.roadmapId) {
            throw new Error('InvalidOperation: No roadmap id');
        }

        if (!action.input.title) {
            throw new Error('InvalidOperation: No title provided');
        }

        const roadmapIndex = state.roadmaps?.findIndex(
            roadmap => roadmap?.id === action.input.roadmapId,
        );
        if (roadmapIndex === -1 || roadmapIndex === undefined) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        const roadmap = state.roadmaps ? state.roadmaps[roadmapIndex] : null;

        if (!roadmap) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        roadmap.title = action.input.title;
    },
    addMilestoneToRoadmapOperation(state, action, dispatch) {
        if (!action.input.roadmapId) {
            throw new Error('InvalidOperation: No roadmap id');
        }

        if (!action.input.milestoneId) {
            throw new Error('InvalidOperation: No milestone provided');
        }

        const roadmapIndex = state.roadmaps?.findIndex(
            roadmap => roadmap?.id === action.input.roadmapId,
        );
        if (roadmapIndex === -1 || roadmapIndex === undefined) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        const roadmap = state.roadmaps ? state.roadmaps[roadmapIndex] : null;

        if (!roadmap) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        const milestone = state.milestones?.find(
            m => m?.id === action.input.milestoneId,
        );

        if (!milestone) {
            throw new Error('InvalidOperation: Milestone not found');
        }

        roadmap.milestones.push(milestone);
    },
    removeMilestoneFromRoadmapOperation(state, action, dispatch) {
        if (!action.input.roadmapId) {
            throw new Error('InvalidOperation: No roadmap id');
        }

        if (!action.input.milestoneId) {
            throw new Error('InvalidOperation: No milestone provided');
        }

        const roadmapIndex = state.roadmaps?.findIndex(
            roadmap => roadmap?.id === action.input.roadmapId,
        );
        if (roadmapIndex === -1 || roadmapIndex === undefined) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        const roadmap = state.roadmaps ? state.roadmaps[roadmapIndex] : null;

        if (!roadmap) {
            throw new Error('InvalidOperation: Roadmap not found');
        }

        roadmap.milestones = roadmap.milestones.filter(
            m => m.id !== action.input.milestoneId,
        );
    },
};
