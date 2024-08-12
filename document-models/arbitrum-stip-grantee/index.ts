/**
 * This is a scaffold file meant for customization.
 * Delete the file and run the code generator again to have it reset
 */

import { actions as BaseActions, DocumentModel } from 'document-model/document';
import { actions as ArbitrumStipGranteeActions, ArbitrumStipGrantee } from './gen';
import { reducer } from './gen/reducer';
import { documentModel } from './gen/document-model';
import genUtils from './gen/utils';
import * as customUtils from './src/utils';
import {
    ArbitrumStipGranteeState,
    ArbitrumStipGranteeAction,
    ArbitrumStipGranteeLocalState,
} from './gen/types';

const Document = ArbitrumStipGrantee;
const utils = { ...genUtils, ...customUtils };
const actions = { ...BaseActions, ...ArbitrumStipGranteeActions };

export const module: DocumentModel<
    ArbitrumStipGranteeState,
    ArbitrumStipGranteeAction,
    ArbitrumStipGranteeLocalState
> = {
    Document,
    reducer,
    actions,
    utils,
    documentModel,
};

export { ArbitrumStipGrantee, Document, reducer, actions, utils, documentModel };

export * from './gen/types';
export * from './src/utils';
