// prettier-ignore
/* eslint-disable */
/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/deliverables/creators';
import { ScopeOfWorkDocument } from '../../gen/types';
import { id } from 'date-fns/locale';

describe('Deliverables Operations', () => {
    let document: ScopeOfWorkDocument;

    beforeEach(() => {
        document = utils.createDocument();
        document.state.global.deliverables = [
            {
                id: '1',
                title: 'Deliverable 1',
                description: 'Description 1',
                keyResults: [
                    {
                        id: '1',
                        title: 'Key Result 1',
                        link: 'https://powerhouse.com',
                    },
                ],
                status: 'IN_PROGRESS',
                workProgress: { value: 0 },
                owner: {
                    id: '1',
                    ref: 'powerhouse-org:team',
                },
                budgetAnchor: {
                    project: '1',
                    workUnitBudget: 12,
                    deliverableBudget: 11
                },
            },
        ];
    });

    it.only('should handle createDeliverable operation', () => {
        const input = {
            id: '1',
            title: 'Deliverable 1',
            description: 'Description 1',
            keyResults: [],
            status: 'DRAFT',
            workProgress: { value: 0 },
            owner: {
                id: '1',
                ref: 'powerhouse-org:team',
                name: 'powerhouse',
                code: 'PHW',
            },
            budgetAnchor: {
                project: '1',
                workUnitBudget: 12,
                deliverableBudget: 11
            },

        }
        const updatedDocument = reducer(
            document,
            creators.createDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });

    it.only('should handle deleteDeliverable operation', () => {

        const input = {
            id: '1',
        }

        const updatedDocument = reducer(
            document,
            creators.deleteDeliverable(input),
        );

        expect(updatedDocument.state.global.deliverables).toHaveLength(0);
    });
    it.only('should handle updateDeliverableDetails operation', () => {
        const input = {
            id: '1',
            title: 'Updated Title',
            description: 'Updated Description',
            owner: {
                id: '2',
                ref: 'powerhouse-org:team',
                name: 'powerhouse',
                code: 'PHW',
            },
        }
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableDetails(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_DELIVERABLE_DETAILS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
        expect(updatedDocument.state.global.deliverables[0].title).toEqual('Updated Title');
    });
    it.only('should handle updateDeliverableStatus operation', () => {
        const input = {
            id: '1',
            status: 'DELIVERED',
        }
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableStatus(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_DELIVERABLE_STATUS',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
        expect(updatedDocument.state.global.deliverables[0].status).toEqual('DELIVERED');
    });
    it.only('should handle addKeyResultToDeliverable operation', () => {
        const input = {
            deliverableId: '1',
            id: '1',
            title: 'Key Result 1',
            link: 'https://powerhouse.com',
        }
        const updatedDocument = reducer(
            document,
            creators.addKeyResultToDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'ADD_KEY_RESULT_TO_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
        expect(updatedDocument.state.global.deliverables[0].keyResults[1].title).toBe('Key Result 1');
    });
    it.only('should handle updateKeyResult operation', () => {
        const input = {
            id: '1',
            title: 'Updated Key Result 1',
            link: 'https://powerhouse.com',
        }

        const updatedDocument = reducer(
            document,
            creators.updateKeyResult(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'UPDATE_KEY_RESULT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
        expect(updatedDocument.state.global.deliverables[0].keyResults[0].title).toBe('Updated Key Result 1');
    });
    it.only('should handle moveKeyResult operation', () => {
        // create deliverable 2
        const input = {
            id: '2',
            title: 'Deliverable 2',
            description: 'Description 2',
            keyResults: [],
        };
        document = reducer(
            document,
            creators.createDeliverable(input),
        );

        const moveInput = {
            id: '1',
            deliverableId: '2',
        }
        const updatedDocument = reducer(
            document,
            creators.moveKeyResult(moveInput),
        );

        expect(updatedDocument.state.global.deliverables[1].keyResults[0].id).toBe('1');
    });
    it.only('should handle removeKeyResultFromDeliverable operation', () => {
        const input = {
            id: '1',
        }
        const updatedDocument = reducer(
            document,
            creators.removeKeyResultFromDeliverable(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'REMOVE_KEY_RESULT_FROM_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
        expect(updatedDocument.state.global.deliverables[0].keyResults).toHaveLength(0);
    });
    it.only('should handle updateDeliverableProgress operation', () => {

        const input = {
            id: '1',
            workProgress: { value: 0.5 },
        }
        const updatedDocument = reducer(
            document,
            creators.updateDeliverableProgress(input),
        );

        expect(updatedDocument.state.global.deliverables[0].workProgress?.value).toEqual(0.5);
    });
    it.only('should handle setDeliverableBudgetAnchor operation', () => {
        const input = {
            id: "1",
            project: "1",
            workUnitBudget: 12,
        }
        const updatedDocument = reducer(
            document,
            creators.setDeliverableBudgetAnchor(input),
        );

        expect(updatedDocument.state.global.deliverables[0].budgetAnchor?.project).toStrictEqual(input.project);
    });
});
