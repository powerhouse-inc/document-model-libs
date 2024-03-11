/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */
import { Project } from '../..';
import { generateId, isProgress, isProjectStatus } from '../utils';
import { ScopeOfWorkProjectsOperations } from '../../gen/projects/operations';

export const reducer: ScopeOfWorkProjectsOperations = {
    createProjectOperation(state, action, dispatch) {
        if (!action.input.code) {
            throw new Error('InvalidOperation: Project must have a code');
        }
        if (action.input.budget < 0) {
            throw new Error('InvalidBudgetValue');
        }
        if (!isProgress(action.input.progress)) {
            throw new Error(
                `InvalidProgressValue: Percentage must be an instance of Progress`,
            );
        }
        const project = {
            ...action.input,
            id: generateId(state.projects as Project[]),
            abstract: action.input.abstract || '',
            imgUrl: action.input.imgUrl || '',
            owner: {
                ...action.input.owner,
                id: generateId(state.projects as Project[]),
            },
            deliverables: [],
        };
        state.projects?.push(project);
    },
    updateProjectStatusOperation(state, action, dispatch) {
        if (!state.projects) {
            throw new Error('InvalidOperation: No projects found');
        }

        const projectIndex = state.projects.findIndex(
            p => p?.id === action.input.projectId,
        );

        if (projectIndex === -1) {
            throw new Error('InvalidOperation: Project not found');
        }

        const project = state.projects[projectIndex];

        if (!isProjectStatus(action.input.status)) {
            throw new Error('InvalidOperation: Project status is not valid');
        }

        if (action.input.status === project?.status) {
            throw new Error(
                'InvalidOperation: Project status is already set to the provided value',
            );
        }

        if (project) {
            project.status = action.input.status;
            state.projects[projectIndex] = project;
        }
    },
    updateProjectDetailsOperation(state, action, dispatch) {
        if (!action.input.projectId) {
            throw new Error('InvalidInputData: ProjectId must be provided');
        }

        const projectIndex = state.projects?.findIndex(
            project => project?.id === action.input.projectId,
        );

        if (projectIndex === -1 || projectIndex === undefined) {
            throw new Error(
                'ProjectNotFound: The specified project does not exist',
            );
        }

        const project = state.projects?.find(
            project => project?.id === action.input.projectId,
        );

        if (project && state.projects !== null) {
            project.title = action.input.title || project.title;
            project.abstract = action.input.abstract || project.abstract;
            project.imgUrl = action.input.imgUrl || project.imgUrl;
            state.projects[projectIndex] = project;
        }
    },
    updateProjectProgressOperation(state, action, dispatch) {
        if (!isProgress(action.input.progress)) {
            throw new Error(
                `InvalidProgressValue: Percentage must be an instance of Progress`,
            );
        }

        const projectIndex = state.projects?.findIndex(
            project => project?.id === action.input.projectId,
        );

        if (projectIndex === -1 || projectIndex === undefined) {
            throw new Error(
                'ProjectNotFound: The specified project does not exist',
            );
        }

        const project = state.projects?.find(
            project => project?.id === action.input.projectId,
        );

        if (project && state.projects !== null) {
            project.progress = action.input.progress;
            state.projects[projectIndex] = project;
        }
    },
    addDeliverableToProjectOperation(state, action, dispatch) {
        if (!action.input.projectId) {
            throw new Error('InvalidInputData: ProjectId must be provided');
        }

        const projectIndex = state.projects?.findIndex(
            project => project?.id === action.input.projectId,
        );

        if (projectIndex === -1 || projectIndex === undefined) {
            throw new Error(
                'ProjectNotFound: The specified project does not exist',
            );
        }

        const project = state.projects?.find(
            project => project?.id === action.input.projectId,
        );

        const deliverable = state.deliverables?.find(
            d => d?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error('InvalidOperation: Deliverable not found');
        }

        if (project && state.projects !== null) {
            project.deliverables?.push(deliverable);
            state.projects[projectIndex] = project;
        }
    },
    removeDeliverableFromProjectOperation(state, action, dispatch) {
        if (!action.input.projectId) {
            throw new Error('InvalidInputData: ProjectId must be provided');
        }

        const projectIndex = state.projects?.findIndex(
            project => project?.id === action.input.projectId,
        );

        if (projectIndex === -1 || projectIndex === undefined) {
            throw new Error(
                'ProjectNotFound: The specified project does not exist',
            );
        }

        const project = state.projects?.find(
            project => project?.id === action.input.projectId,
        );

        if (project && state.projects !== null) {
            project.deliverables = (project.deliverables || []).filter(
                d => d.id !== action.input.deliverableId,
            );
            state.projects[projectIndex] = project;
        }
    },
    deleteProjectOperation(state, action, dispatch) {
        if (!action.input.projectId) {
            throw new Error('InvalidInputData: ProjectId must be provided');
        }

        const projectIndex = state.projects?.findIndex(
            project => project?.id === action.input.projectId,
        );

        if (projectIndex === -1 || projectIndex === undefined) {
            throw new Error(
                'ProjectNotFound: The specified project does not exist',
            );
        }

        state.projects?.splice(projectIndex, 1);
    },
    assignProjectOwnerOperation(state, action, dispatch) {
        if (!action.input.projectId) {
            throw new Error('InvalidInputData: ProjectId must be provided');
        }

        const projectIndex = state.projects?.findIndex(
            project => project?.id === action.input.projectId,
        );

        if (projectIndex === -1 || projectIndex === undefined) {
            throw new Error(
                'ProjectNotFound: The specified project does not exist',
            );
        }

        const project = state.projects?.find(
            project => project?.id === action.input.projectId,
        );

        if (project && state.projects !== null) {
            project.owner = {
                ...action.input.owner,
                id: generateId(state.projects as Project[]),
            };
            state.projects[projectIndex] = project;
        }
    },
};
