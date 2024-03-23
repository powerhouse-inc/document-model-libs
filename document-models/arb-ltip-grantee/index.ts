/**
 * This is a scaffold file meant for customization.
 * Delete the file and run the code generator again to have it reset
 */

import { actions as BaseActions, DocumentModel } from 'document-model/document';
import { actions as ArbLtipGranteeActions, ArbLtipGrantee } from './gen';
import { reducer } from './gen/reducer';
import { documentModel } from './gen/document-model';
import genUtils from './gen/utils';
import * as customUtils from './src/utils';
import {
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
} from './gen/types';

const Document = ArbLtipGrantee;
const utils = { ...genUtils, ...customUtils };
const actions = { ...BaseActions, ...ArbLtipGranteeActions };

export const module: DocumentModel<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState
> = {
    Document,
    reducer,
    actions,
    utils,
    documentModel,
};

export { ArbLtipGrantee, Document, reducer, actions, utils, documentModel };

export * from './gen/types';
export * from './src/utils';
