import { Action } from '../../../document';

import {
    AddOperationInput,
    SetOperationNameInput,
    SetOperationSchemaInput,
    SetOperationDescriptionInput,
    SetOperationTemplateInput,
    SetOperationReducerInput,
    MoveOperationInput,
    DeleteOperationInput,
    ReorderModuleOperationsInput,
} from '@acaldas/document-model-graphql/document-model';

export type AddOperationAction = Action<'ADD_OPERATION', AddOperationInput>;
export type SetOperationNameAction = Action<'SET_OPERATION_NAME', SetOperationNameInput>;
export type SetOperationSchemaAction = Action<'SET_OPERATION_SCHEMA', SetOperationSchemaInput>;
export type SetOperationDescriptionAction = Action<'SET_OPERATION_DESCRIPTION', SetOperationDescriptionInput>;
export type SetOperationTemplateAction = Action<'SET_OPERATION_TEMPLATE', SetOperationTemplateInput>;
export type SetOperationReducerAction = Action<'SET_OPERATION_REDUCER', SetOperationReducerInput>;
export type MoveOperationAction = Action<'MOVE_OPERATION', MoveOperationInput>;
export type DeleteOperationAction = Action<'DELETE_OPERATION', DeleteOperationInput>;
export type ReorderModuleOperationsAction = Action<'REORDER_MODULE_OPERATIONS', ReorderModuleOperationsInput>;

export type DocumentModelOperationAction = 
    | AddOperationAction
    | SetOperationNameAction
    | SetOperationSchemaAction
    | SetOperationDescriptionAction
    | SetOperationTemplateAction
    | SetOperationReducerAction
    | MoveOperationAction
    | DeleteOperationAction
    | ReorderModuleOperationsAction
;