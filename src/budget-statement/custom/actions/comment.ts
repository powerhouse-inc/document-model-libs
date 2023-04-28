import { hashKey } from '../../../document/utils';
import {
    AddCommentAction,
    DeleteCommentAction,
    UpdateCommentAction,
} from '../../gen/comment/types';
import { BudgetStatementDocument, Comment } from '../types';

const sortComment = (a: Comment, b: Comment) =>
    a.timestamp < b.timestamp ? -1 : 1;

export const addCommentOperation = (
    state: BudgetStatementDocument,
    action: AddCommentAction
) => {
    state.data.comments.push(
        ...action.input.comments.map(input => ({
            key: input.key ?? hashKey(),
            author: {
                ref: null,
                id: null,
                username: null,
                roleLabel: null,
                ...input.author,
            },
            comment: input.comment || '',
            timestamp: input.timestamp || new Date().toISOString(),
            status: input.status ?? 'Draft',
        }))
    );
    state.data.comments.sort(sortComment);
};

export const updateCommentOperation = (
    state: BudgetStatementDocument,
    action: UpdateCommentAction
) => {
    action.input.comments.forEach(input => {
        const index = state.data.comments.findIndex(c => c.key === input.key);
        if (index === -1) {
            return;
        }
        const comment = state.data.comments[index];
        state.data.comments[index] = {
            ...comment,
            ...input,
            author: {
                id: input.author?.id ?? comment.author.id,
                ref: input.author?.ref ?? comment.author.ref,
                roleLabel: input.author?.roleLabel ?? comment.author.roleLabel,
                username: input.author?.username ?? comment.author.username,
            },
            comment: input.comment ?? comment.comment,
            timestamp: input.timestamp ?? comment.timestamp,
        };
    });
    state.data.comments.sort(sortComment);
};

export const deleteCommentOperation = (
    state: BudgetStatementDocument,
    action: DeleteCommentAction
) => {
    state.data.comments = state.data.comments.filter(
        comment => !action.input.comments.includes(comment.key)
    );
};
