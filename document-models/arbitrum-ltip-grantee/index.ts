/**
 * This is a scaffold file meant for customization.
 * Delete the file and run the code generator again to have it reset
 */

import { actions as BaseActions, DocumentModel } from 'document-model/document';
import { actions as ArbitrumLtipGranteeActions, ArbitrumLtipGrantee } from './gen';
import { reducer } from './gen/reducer';
import { documentModel } from './gen/document-model';
import genUtils from './gen/utils';
import * as customUtils from './src/utils';
import {
    ArbitrumLtipGranteeState,
    ArbitrumLtipGranteeAction,
    ArbitrumLtipGranteeLocalState,
} from './gen/types';

const Document = ArbitrumLtipGrantee;
const utils = { ...genUtils, ...customUtils };
const actions = { ...BaseActions, ...ArbitrumLtipGranteeActions };

export const module: DocumentModel<
    ArbitrumLtipGranteeState,
    ArbitrumLtipGranteeAction,
    ArbitrumLtipGranteeLocalState
> = {
    Document,
    reducer,
    actions,
    utils,
    documentModel,
};

export { ArbitrumLtipGrantee, Document, reducer, actions, utils, documentModel };

export * from './gen/types';
export * from './src/utils';
