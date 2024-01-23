/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from '@powerhousedao/codegen';

import * as creators from '../../gen/attachments/creators';
import { reducer } from '../../gen/reducer';
import { z } from '../../gen/schema';
import { RwaPortfolioDocument } from '../../gen/types';
import utils from '../../gen/utils';

describe('Attachments Operations', () => {
    let document: RwaPortfolioDocument;

    beforeEach(() => {
        document = utils.createDocument();
    });

    it('should handle createAttachment operation', () => {
        const input = generateMock(z.CreateAttachmentInputSchema());
        const updatedDocument = reducer(
            document,
            creators.createAttachment(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'CREATE_ATTACHMENT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle editAttachment operation', () => {
        const input = generateMock(z.EditAttachmentInputSchema());
        const document = utils.createDocument({
            attachments: [input],
        });
        const updatedDocument = reducer(
            document,
            creators.editAttachment(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'EDIT_ATTACHMENT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
    it('should handle deleteAttachment operation', () => {
        const input = generateMock(z.DeleteAttachmentInputSchema());
        const updatedDocument = reducer(
            document,
            creators.deleteAttachment(input),
        );

        expect(updatedDocument.operations.global).toHaveLength(1);
        expect(updatedDocument.operations.global[0].type).toBe(
            'DELETE_ATTACHMENT',
        );
        expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
        expect(updatedDocument.operations.global[0].index).toEqual(0);
    });
});
