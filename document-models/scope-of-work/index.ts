/**
 * This is a scaffold file meant for customization.
 * Delete the file and run the code generator again to have it reset
 */

import { actions as BaseActions, DocumentModel } from 'document-model/document';
import { actions as ScopeOfWorkActions, ScopeOfWork } from './gen';
import { reducer } from './gen/reducer';
import { documentModel } from './gen/document-model';
import genUtils from './gen/utils';
import * as customUtils from './src/utils';
import {
    ScopeOfWorkState,
    ScopeOfWorkAction,
    ScopeOfWorkLocalState,
} from './gen/types';

const Document = ScopeOfWork;
const utils = { ...genUtils, ...customUtils };
const actions = { ...BaseActions, ...ScopeOfWorkActions };

export const module: DocumentModel<
    ScopeOfWorkState,
    ScopeOfWorkAction,
    ScopeOfWorkLocalState
> = {
    Document,
    reducer,
    actions,
    utils,
    documentModel,
};

export { ScopeOfWork, Document, reducer, actions, utils, documentModel };

export * from './gen/types';
export * from './src/utils';
