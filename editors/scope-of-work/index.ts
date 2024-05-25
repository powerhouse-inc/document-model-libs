import { lazyWithPreload } from 'document-model-libs/utils';
import type {
    ScopeOfWorkAction,
    ScopeOfWorkLocalState,
    ScopeOfWorkState
} from '../../document-models/scope-of-work';
import type { ExtendedEditor } from '../types';

export const module: ExtendedEditor<
    ScopeOfWorkState,
    ScopeOfWorkAction,
    ScopeOfWorkLocalState
> = {
    Component: lazyWithPreload(() => import('./editor')),
    documentTypes: ['powerhouse/scope-of-work'],
    config: {
        id: 'scope-of-work-editor',
        disableExternalControls: false,
    },
};

export default module;
