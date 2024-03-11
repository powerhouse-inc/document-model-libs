/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { Milestones, MilestoneProgress } from '../../gen/schema/types';
import { generateId, isProgress } from '../utils';
import { ScopeOfWorkMilestonesOperations } from '../../gen/milestones/operations';

export const reducer: ScopeOfWorkMilestonesOperations = {
    createMilestoneOperation(state, action, dispatch) {
        if (!action.input.roadmapId) {
            throw new Error(`InvalidOperation: Roadmap must have an id`);
        }
        if (!action.input.code) {
            throw new Error(`InvalidOperation: Milestone must have a code`);
        }
        if (!action.input.title) {
            throw new Error(`InvalidOperation: Milestone must have a title`);
        }
        if (!action.input.description) {
            throw new Error(
                `InvalidOperation: Milestone must have a description`,
            );
        }
        if (
            typeof action.input.estimatedBudgetCap !== 'number' ||
            action.input.estimatedBudgetCap < 0
        ) {
            throw new Error(
                `InvalidBudgetValue: Milestone's estimated budget cap must be a positive number`,
            );
        }
        if (action.input.contributorTeams.length === 0) {
            throw new Error(
                `InvalidOperation: Milestone must have at least one contributor team`,
            );
        }
        if (action.input.coordinators.length === 0) {
            throw new Error(
                `InvalidOperation: Milestone must have at least one coordinator`,
            );
        }

        const progress: MilestoneProgress = {
            status: 'TODO',
            indication: {
                completed: 0,
                total: 0,
            },
        };

        const coordinators = action.input.coordinators.map(
            (coordinator, index) => {
                return {
                    id: index.toString(),
                    ref: coordinator?.ref || '',
                    name: coordinator?.name || '',
                    code: coordinator?.code || '',
                };
            },
        );
        const contributorTeams = action.input.contributorTeams.map(
            (contributorTeam, index) => {
                return {
                    id: index.toString(),
                    ref: contributorTeam?.ref || '',
                    imgUrl: contributorTeam?.imgUrl || '',
                    name: contributorTeam?.name || '',
                    code: contributorTeam?.code || '',
                };
            },
        );
        const newMilestone = {
            id: generateId(state.milestones as Milestones[]),
            code: action.input.code,
            title: action.input.title,
            description: action.input.description,
            progress,
            targetDate: action.input.targetDate || null,
            estimatedBudgetCap: action.input.estimatedBudgetCap,
            budgetExpenditure: {
                percentage: 0,
                actuals: 0,
                cap: action.input.estimatedBudgetCap,
            },
            roadmapId: action.input.roadmapId,
            imgURL: action.input.imgURL,
            coordinators,
            contributorTeams,
            deliverables: [],
        };
        state.milestones?.push(newMilestone);
    },
    updateMilestoneProgressOperation(state, action, dispatch) {
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `InvalidOperation: Milestone with id ${action.input.milestoneId} not found`,
            );
        }
        if (!action.input.progress.indication) {
            throw new Error(
                `InvalidOperation: Milestone progress must have an indication`,
            );
        }
        //check if progress is valid
        if (!isProgress(action.input.progress.indication)) {
            throw new Error(
                `InvalidProgressValue: Progress indication is invalid`,
            );
        }
        milestone.progress = action.input.progress;
    },
    addDeliverableToMilestoneOperation(state, action, dispatch) {
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `InvalidOperation: Milestone with id ${action.input.milestoneId} not found`,
            );
        }
        if (!action.input.deliverableId) {
            throw new Error(`InvalidOperation: Deliverable must be provided`);
        }
        const deliverable = state.deliverables?.find(
            deliverable => deliverable?.id === action.input.deliverableId,
        );
        if (!deliverable) {
            throw new Error(
                `InvalidOperation: Deliverable with id ${action.input.deliverableId} not found`,
            );
        }
        milestone.deliverables?.push(deliverable);
    },
    deleteMilestoneOperation(state, action, dispatch) {
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const milestoneIndex = state.milestones?.findIndex(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (milestoneIndex === -1 || !milestoneIndex) {
            throw new Error(
                `InvalidOperation: Milestone with id ${action.input.milestoneId} not found`,
            );
        }
        state.milestones?.splice(milestoneIndex, 1);
    },
    updateMilestoneDetailsOperation(state, action, dispatch) {
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `InvalidOperation: Milestone with id ${action.input.milestoneId} not found`,
            );
        }
        if (action.input.title) {
            milestone.title = action.input.title;
        }
        if (action.input.description) {
            milestone.description = action.input.description;
        }
        if (action.input.targetDate) {
            milestone.targetDate = action.input.targetDate;
        }
    },
    updateMilestoneBudgetOperation(state, action, dispatch) {
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `InvalidOperation: Milestone with id ${action.input.milestoneId} not found`,
            );
        }
        if (action.input.estimatedBudgetCap) {
            milestone.estimatedBudgetCap = action.input.estimatedBudgetCap;
        }
        milestone.budgetExpenditure = {
            percentage: action.input.budgetExpenditure.percentage || 0,
            actuals: action.input.budgetExpenditure.actuals || 0,
            cap: action.input.budgetExpenditure.cap || 0,
        };
    },
    assignCoordinatorToMilestoneOperation(state, action, dispatch) {
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `InvalidOperation: Milestone with id ${action.input.milestoneId} not found`,
            );
        }
        if (!action.input.coordinatorId) {
            throw new Error(`InvalidOperation: CoordinatorId must be provided`);
        }

        const coordinator = state.milestones
            ?.map(milestone => milestone?.coordinators)
            .flat()
            .find(
                coordinator => coordinator?.id === action.input.coordinatorId,
            );
        if (!coordinator) {
            throw new Error(
                `InvalidOperation: Coordinator with id ${action.input.coordinatorId} not found`,
            );
        }
        milestone.coordinators.push(coordinator);
    },
    addContributorTeamToMilestoneOperation(state, action, dispatch) {
        if (!action.input.milestoneId) {
            throw new Error(`InvalidOperation: Milestone must have an id`);
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `InvalidOperation: Milestone with id ${action.input.milestoneId} not found`,
            );
        }
        if (!action.input.contributorTeamId) {
            throw new Error(
                `InvalidOperation: ContributorTeamId must be provided`,
            );
        }

        const contributorTeam = state.milestones
            ?.map(milestone => milestone?.contributorTeams)
            .flat()
            .find(
                contributorTeam =>
                    contributorTeam?.id === action.input.contributorTeamId,
            );
        if (!contributorTeam) {
            throw new Error(
                `ContributorTeamNotFound: ContributorTeam with id ${action.input.contributorTeamId} not found`,
            );
        }
        milestone.contributorTeams.push(contributorTeam);
    },
    removeContributorTeamFromMilestoneOperation(state, action, dispatch) {
        if (!action.input.milestoneId) {
            throw new Error(`MilestoneNotFound: Milestone must have an id`);
        }
        const milestone = state.milestones?.find(
            milestone => milestone?.id === action.input.milestoneId,
        );
        if (!milestone) {
            throw new Error(
                `MilestoneNotFound: Milestone with id ${action.input.milestoneId} not found`,
            );
        }
        if (!action.input.contributorTeamId) {
            throw new Error(
                `ContributorTeamNotFound: ContributorTeamId must be provided`,
            );
        }
        const contributorTeamIndex = milestone.contributorTeams?.findIndex(
            contributorTeam =>
                contributorTeam.id === action.input.contributorTeamId,
        );
        if (contributorTeamIndex === -1 || !contributorTeamIndex) {
            throw new Error(
                `ContributorTeamNotFound: ContributorTeam with id ${action.input.contributorTeamId} not found`,
            );
        }
        milestone.contributorTeams.splice(contributorTeamIndex, 1);
    },
};
