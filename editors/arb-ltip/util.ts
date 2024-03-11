import { Maybe } from 'document-model/document-model';

export function maybeToArray<T>(value: Maybe<Maybe<T>[]>): T[] {
    if (!value) {
        return [];
    }

    return value.filter(v => v !== null) as T[];
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
