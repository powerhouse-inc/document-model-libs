/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { RwaAttachment } from '../..';
import { RwaPortfolioAttachmentsOperations } from '../../gen/attachments/operations';

export const reducer: RwaPortfolioAttachmentsOperations = {
    createAttachmentOperation(state, action, dispatch) {
        state.attachments.push(action.input);
    },
    editAttachmentOperation(state, action, dispatch) {
        state.attachments = state.attachments.map(attachment =>
            attachment.id === action.input.id
                ? ({
                      ...attachment,
                      ...action.input,
                  } as RwaAttachment)
                : attachment,
        );
    },
    deleteAttachmentOperation(state, action, dispatch) {
        state.attachments = state.attachments.filter(
            attachment => attachment.id !== action.input.id,
        );
    },
};
