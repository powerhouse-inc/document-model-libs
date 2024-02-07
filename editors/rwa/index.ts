import { Editor as EditorModule } from 'document-model/document';
import Editor from './editor';
import {
    RealWorldAssetsState,
    RealWorldAssetsLocalState,
    RealWorldAssetsAction,
} from '../../document-models/real-world-assets';

export const module: EditorModule<
    RealWorldAssetsState,
    RealWorldAssetsAction,
    RealWorldAssetsLocalState
> = {
    Component: Editor,
    documentTypes: ['powerhouse/real-world-assets'],
};

export default module;
