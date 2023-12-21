/**
* This is a scaffold file meant for customization.
* Delete the file and run the code generator again to have it reset
*/

import { actions as BaseActions, DocumentModel } from 'document-model/document';
import { actions as RwaPortfolioActions, RwaPortfolio } from './gen';
import { reducer } from './gen/reducer';
import { documentModel } from './gen/document-model';
import genUtils from './gen/utils';
import * as customUtils from './src/utils';
import { RwaPortfolioState, RwaPortfolioAction } from './gen/types';

const Document = RwaPortfolio;
const utils = { ...genUtils, ...customUtils };
const actions = { ...BaseActions, ...RwaPortfolioActions };

export const module: DocumentModel<
    RwaPortfolioState,
    RwaPortfolioAction,
    RwaPortfolio
> = {
    Document,
    reducer,
    actions,
    utils,
    documentModel
};

export {
    RwaPortfolio,
    Document,
    reducer,
    actions,
    utils,
    documentModel
}

export * from './gen/types';
export * from './src/utils';