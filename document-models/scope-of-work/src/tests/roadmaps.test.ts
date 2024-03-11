/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/roadmaps/creators';
import { ScopeOfWorkDocument } from '../../gen/types';

describe('Roadmaps Operations', () => {
    let document: ScopeOfWorkDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createRoadmap operation', () => {
        const input = generateMock(z.CreateRoadmapInputSchema());
        const updatedDocument = reducer(
            document,
            creators.createRoadmap(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_ROADMAP',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateRoadmapDescription operation', () => {
        const input = generateMock(z.UpdateRoadmapDescriptionInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateRoadmapDescription(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_ROADMAP_DESCRIPTION',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteRoadmap operation', () => {
        const input = generateMock(z.DeleteRoadmapInputSchema());
        const updatedDocument = reducer(
            document,
            creators.deleteRoadmap(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_ROADMAP',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateRoadmapTitle operation', () => {
        const input = generateMock(z.UpdateRoadmapTitleInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateRoadmapTitle(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_ROADMAP_TITLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle addMilestoneToRoadmap operation', () => {
        const input = generateMock(z.AddMilestoneToRoadmapInputSchema());
        const updatedDocument = reducer(
            document,
            creators.addMilestoneToRoadmap(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_MILESTONE_TO_ROADMAP',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle removeMilestoneFromRoadmap operation', () => {
        const input = generateMock(z.RemoveMilestoneFromRoadmapInputSchema());
        const updatedDocument = reducer(
            document,
            creators.removeMilestoneFromRoadmap(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'REMOVE_MILESTONE_FROM_ROADMAP',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
