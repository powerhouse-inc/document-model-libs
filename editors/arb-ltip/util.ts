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

export const pad = (num: string, size: number) => {
    let s = num + '';
    while (s.length < size) s = '0' + s;
    return s;
};

export const formatDate = (date: string) => {
    const parts = new Date(date).toLocaleDateString('en-US').split('/');
    return `${pad(parts[0], 2)} / ${pad(parts[1], 2)}`;
};
