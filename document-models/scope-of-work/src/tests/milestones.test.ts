/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/milestones/creators';
import { ScopeOfWorkDocument } from '../../gen/types';

describe('Milestones Operations', () => {
    let document: ScopeOfWorkDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createMilestone operation', () => {
        const input = generateMock(z.CreateMilestoneInputSchema());
        const updatedDocument = reducer(
            document,
            creators.createMilestone(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_MILESTONE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateMilestoneProgress operation', () => {
        const input = generateMock(z.UpdateMilestoneProgressInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateMilestoneProgress(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_MILESTONE_PROGRESS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle addDeliverableToMilestone operation', () => {
        const input = generateMock(z.AddDeliverableToMilestoneInputSchema());
        const updatedDocument = reducer(
            document,
            creators.addDeliverableToMilestone(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_DELIVERABLE_TO_MILESTONE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteMilestone operation', () => {
        const input = generateMock(z.DeleteMilestoneInputSchema());
        const updatedDocument = reducer(
            document,
            creators.deleteMilestone(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_MILESTONE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateMilestoneDetails operation', () => {
        const input = generateMock(z.UpdateMilestoneDetailsInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateMilestoneDetails(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_MILESTONE_DETAILS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateMilestoneBudget operation', () => {
        const input = generateMock(z.UpdateMilestoneBudgetInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateMilestoneBudget(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_MILESTONE_BUDGET',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle assignCoordinatorToMilestone operation', () => {
        const input = generateMock(z.AssignCoordinatorToMilestoneInputSchema());
        const updatedDocument = reducer(
            document,
            creators.assignCoordinatorToMilestone(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ASSIGN_COORDINATOR_TO_MILESTONE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle addContributorTeamToMilestone operation', () => {
        const input = generateMock(z.AddContributorTeamToMilestoneInputSchema());
        const updatedDocument = reducer(
            document,
            creators.addContributorTeamToMilestone(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_CONTRIBUTOR_TEAM_TO_MILESTONE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle removeContributorTeamFromMilestone operation', () => {
        const input = generateMock(z.RemoveContributorTeamFromMilestoneInputSchema());
        const updatedDocument = reducer(
            document,
            creators.removeContributorTeamFromMilestone(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'REMOVE_CONTRIBUTOR_TEAM_FROM_MILESTONE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
