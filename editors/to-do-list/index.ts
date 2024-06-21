import { lazyWithPreload } from 'document-model-libs/utils';
import type { ExtendedEditor } from '../types';

export const module: ExtendedEditor = {
    Component: lazyWithPreload(() => import('./to-do-list')),
    documentTypes: ['*'],
    config: {
        id: 'to-do-list-editor',
        disableExternalControls: false,
    },
};

export default module;
