import JSONDeterministic from 'json-stringify-deterministic';
import { BaseAction } from '../actions/types';
import { baseReducer } from '../reducer';
import { Action, Document, ImmutableReducer } from '../types';
import { hash } from './node';

/**
 * Helper function to be used by action creators.
 *
 * @remarks
 * Creates an action with the given type and input properties. The input
 * properties default to an empty object.
 *
 * @typeParam A - Type of the action to be returned.
 *
 * @param type - The type of the action.
 * @param input - The input properties of the action.
 *
 * @throws Error if the type is empty or not a string.
 *
 * @returns The new action.
 */
export function createAction<A extends Action>(
    type: A['type'],
    input?: A['input'],
    validator?: () => { parse(v: unknown): A }
): A {
    if (!type) {
        throw new Error('Empty action type');
    }

    if (typeof type !== 'string') {
        throw new Error(`Invalid action type: ${type}`);
    }

    const action = { type, input };
    validator?.().parse(action);

    return action as unknown as A;
}

/**
 * Helper generic type to convert an Input type to Action type.
 */
export type ActionType<T extends string, I> = { 
    type: T,
    input: I
};

/**
 * Helper function to create a document model reducer.
 *
 * @remarks
 * This function creates a new reducer that wraps the provided `reducer` with
 * `documentReducer`, adding support for document actions:
 *   - `SET_NAME`
 *   - `UNDO`
 *   - `REDO`
 *   - `PRUNE`
 *
 * It also updates the document-related attributes on every operation.
 *
 * @param reducer - The custom reducer to wrap.
 * @param documentReducer - The document reducer to use.
 *
 * @returns The new reducer.
 */
export function createReducer<T = unknown, A extends Action = Action>(
    reducer: ImmutableReducer<T, A>,
    documentReducer = baseReducer
) {
    return (state: Document<T, A | BaseAction>, action: A | BaseAction) => {
        return documentReducer<T, A>(state, action, reducer);
    };
}

/**
 * Builds the initial document state from the provided data.
 *
 * @typeParam T - The type of the data.
 * @typeParam A - The type of the actions.
 *
 * @param initialState - The initial state of the document. The `data` property
 *   is required, but all other properties are optional.
 *
 * @returns The new document state.
 */
export const createDocument = <T, A extends Action>(
    initialState?: Partial<Document<T, A>> & { data: T }
): Document<T, A> => {
    const state = {
        name: '',
        documentType: '',
        revision: 0,
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        data: {} as T,
        operations: [],
        fileRegistry: {},
        ...initialState,
    };

    // saves the initial state
    const { initialState: _, ...newInitialState } = state;
    return {
        ...state,
        initialState: newInitialState,
    };
};

export const hashDocument = (state: Document) => {
    return hash(JSONDeterministic(state.data));
};

export const hashKey = (date?: Date, randomLimit = 1000) => {
    const random = Math.random() * randomLimit;
    return hash(`${(date ?? new Date()).toISOString()}${random}`);
};
