import { lazyWithPreload } from 'document-model-libs/utils';
import type {
    ArbitrumLtipGranteeAction,
    ArbitrumLtipGranteeLocalState,
    ArbitrumLtipGranteeState,
} from '../../document-models/arbitrum-ltip-grantee';
import type { ExtendedEditor } from '../types';
import type { CustomEditorProps } from './editor';

export const module: ExtendedEditor<
    ArbitrumLtipGranteeState,
    ArbitrumLtipGranteeAction,
    ArbitrumLtipGranteeLocalState,
    CustomEditorProps
> = {
    Component: lazyWithPreload(() => import('./editor')),
    documentTypes: ['arbitrum/ltip-grantee'],
    config: {
        id: 'arb-ltip-editor',
        disableExternalControls: true,
    },
};

export default module;
