/**
 * This is a scaffold file meant for customization.
 * Delete the file and run the code generator again to have it reset
 */

import { actions as BaseActions, DocumentModel } from 'document-model/document';
import { actions as ToDoListActions, ToDoList } from './gen';
import { reducer } from './gen/reducer';
import { documentModel } from './gen/document-model';
import genUtils from './gen/utils';
import * as customUtils from './src/utils';
import {
    ToDoListState,
    ToDoListAction,
    ToDoListLocalState,
} from './gen/types';

const Document = ToDoList;
const utils = { ...genUtils, ...customUtils };
const actions = { ...BaseActions, ...ToDoListActions };

export const module: DocumentModel<
    ToDoListState,
    ToDoListAction,
    ToDoListLocalState
> = {
    Document,
    reducer,
    actions,
    utils,
    documentModel,
};

export { ToDoList, Document, reducer, actions, utils, documentModel };

export * from './gen/types';
export * from './src/utils';
