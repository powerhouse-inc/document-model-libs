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

export function toArray<T>(value: Maybe<Array<Maybe<T>>>): T[] {
    return value?.map(v => v as T) || [];
}
