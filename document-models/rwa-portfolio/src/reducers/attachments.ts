/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { RwaPortfolioAttachmentsOperations } from '../../gen/attachments/operations';

function isValidFileType(fileType: string) {
    return fileType.length > 0 && new RegExp('.[a-zA-Z]+$/').test(fileType);
}

export const reducer: RwaPortfolioAttachmentsOperations = {
    createAttachmentOperation(state, action, dispatch) {
        if (
            !action.input.id ||
            !action.input.title ||
            !action.input.fileType ||
            !action.input.hash
        ) {
            throw new Error('Id, title, fileType, and hash are required');
        }

        if (
            state.attachments.find(
                attachment => attachment.id === action.input.id,
            )
        ) {
            throw new Error(
                `Attachment with id ${action.input.id} already exists`,
            );
        }

        if (!isValidFileType(action.input.fileType)) {
            throw new Error(`Invalid file type: ${action.input.fileType}`);
        }

        state.attachments.push({
            ...action.input,
        });
    },
    editAttachmentOperation(state, action, dispatch) {
        if (
            !action.input.id ||
            !action.input.title ||
            !action.input.fileType ||
            !action.input.hash
        ) {
            throw new Error('Id, title, fileType, and hash are required');
        }

        if (
            !state.attachments.find(
                attachment => attachment.id === action.input.id,
            )
        ) {
            throw new Error(
                `Attachment with id ${action.input.id} does not exist`,
            );
        }

        if (!isValidFileType(action.input.fileType)) {
            throw new Error(`Invalid file type: ${action.input.fileType}`);
        }
    },
    deleteAttachmentOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Id is required');
        }

        if (
            !state.attachments.find(
                attachment => attachment.id === action.input.id,
            )
        ) {
            throw new Error(
                `Attachment with id ${action.input.id} does not exist`,
            );
        }

        state.attachments = state.attachments.filter(
            attachment => attachment.id !== action.input.id,
        );
    },
};
