import { lazyWithPreload } from 'document-model-libs/utils';
import type { ExtendedEditor } from '../types';
import type { CustomEditorProps } from './editor';
import { ArbitrumLtipGranteeAction } from 'document-models/arbitrum-ltip-grantee/gen';
import {
    ArbitrumLtipGranteeLocalState,
    ArbitrumLtipGranteeState,
} from 'document-models/arbitrum-ltip-grantee/gen/types';

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
