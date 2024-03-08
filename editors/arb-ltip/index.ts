import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
} from '../../document-models/arb-ltip-grantee';
import { ExtendedEditor } from '../types';
import Editor, { CustomEditorProps } from './editor';

export const module: ExtendedEditor<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    CustomEditorProps
> = {
    Component: Editor,
    documentTypes: ['ARBLTIPGrantee'],
    config: {
        id: 'arb-ltip-editor',
        disableExternalControls: true,
    },
};

export default module;
