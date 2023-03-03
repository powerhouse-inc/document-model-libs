import { BaseAction } from './actions';

export type Action<T = string> = {
    type: T;
    input?: unknown;
};

export type Reducer<State, A extends Action> = (
    state: Document<State, A>,
    action: A
) => Document<State, A>;

export type Operation<A extends Action = Action> = A & { index: number };

export type DocumentHeader = {
    name: string;
    revision: number;
    documentType: string;
    created: string;
    lastModified: string;
};

export type Document<
    Data = unknown,
    A extends Action = Action
> = DocumentHeader & {
    data: Data;
    operations: Operation<A | BaseAction>[];
    initialData: Data;
};
