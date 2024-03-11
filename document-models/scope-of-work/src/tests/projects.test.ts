/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/projects/creators';
import { ScopeOfWorkDocument } from '../../gen/types';

describe('Projects Operations', () => {
    let document: ScopeOfWorkDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createProject operation', () => {
        const input = generateMock(z.CreateProjectInputSchema());
        const updatedDocument = reducer(
            document,
            creators.createProject(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_PROJECT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateProjectStatus operation', () => {
        const input = generateMock(z.UpdateProjectStatusInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateProjectStatus(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_PROJECT_STATUS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateProjectDetails operation', () => {
        const input = generateMock(z.UpdateProjectDetailsInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateProjectDetails(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_PROJECT_DETAILS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle updateProjectProgress operation', () => {
        const input = generateMock(z.UpdateProjectProgressInputSchema());
        const updatedDocument = reducer(
            document,
            creators.updateProjectProgress(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_PROJECT_PROGRESS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle addDeliverableToProject operation', () => {
        const input = generateMock(z.AddDeliverableToProjectInputSchema());
        const updatedDocument = reducer(
            document,
            creators.addDeliverableToProject(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_DELIVERABLE_TO_PROJECT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle removeDeliverableFromProject operation', () => {
        const input = generateMock(z.RemoveDeliverableFromProjectInputSchema());
        const updatedDocument = reducer(
            document,
            creators.removeDeliverableFromProject(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'REMOVE_DELIVERABLE_FROM_PROJECT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteProject operation', () => {
        const input = generateMock(z.DeleteProjectInputSchema());
        const updatedDocument = reducer(
            document,
            creators.deleteProject(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_PROJECT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle assignProjectOwner operation', () => {
        const input = generateMock(z.AssignProjectOwnerInputSchema());
        const updatedDocument = reducer(
            document,
            creators.assignProjectOwner(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ASSIGN_PROJECT_OWNER',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
