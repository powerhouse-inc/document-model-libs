/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import utils from '../../gen/utils';
import { CreateDeliverableInput, z } from '../../gen/schema';
import { reducer } from '../../gen/reducer';
import * as creators from '../../gen/deliverables/creators';
import { ScopeOfWorkDocument } from '../../gen/types';

function generateId(): string {
    return (Math.random() + 1).toString(36).substring(7);
}

describe('Deliverables Operations', () => {
    let document: ScopeOfWorkDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createDeliverable operation', () => {
        const input: CreateDeliverableInput = {
            id: generateId(),
            title: 'My new deliverable',
        };

        const updatedDocument = reducer(
            document,
            creators.createDeliverable(input),
        );

        expect(updatedDocument.state.global.deliverables).toHaveLength(1);
        expect(updatedDocument.state.global.deliverables[0].id).toEqual(
            input.id,
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_DELIVERABLE',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
