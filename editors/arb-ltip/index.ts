import { lazyWithPreload } from 'document-model-libs/utils';
import type {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
} from '../../document-models/arb-ltip-grantee';
import type { ExtendedEditor } from '../types';
import type { CustomEditorProps } from './editor';

export const module: ExtendedEditor<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    CustomEditorProps
> = {
    Component: lazyWithPreload(() => import('./editor')),
    documentTypes: ['ArbLtipGrantee'],
    config: {
        id: 'arb-ltip-editor',
        disableExternalControls: true,
    },
};

export default module;
