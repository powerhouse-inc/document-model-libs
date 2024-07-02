import { lazyWithPreload } from 'document-model-libs/utils';
import type { ExtendedEditor } from '../types';
import type { CustomEditorProps } from './editor';
import { ArbitrumStipGranteeAction } from 'document-models/arbitrum-stip-grantee/gen';
import {
    ArbitrumStipGranteeLocalState,
    ArbitrumStipGranteeState,
} from 'document-models/arbitrum-stip-grantee/gen/types';

export const module: ExtendedEditor<
    ArbitrumStipGranteeState,
    ArbitrumStipGranteeAction,
    ArbitrumStipGranteeLocalState,
    CustomEditorProps
> = {
    Component: lazyWithPreload(() => import('./editor')),
    documentTypes: ['arbitrum/stip-grantee'],
    config: {
        id: 'arb-stip-editor',
        disableExternalControls: true,
    },
};

export default module;
