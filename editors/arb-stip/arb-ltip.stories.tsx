import { reducer, utils } from '../../document-models/arbitrum-stip-grantee';
import Editor from './editor';
import { createDocumentStory } from 'document-model-libs/utils';

const { meta, CreateDocumentStory: DocumentModel } = createDocumentStory(
    // @ts-expect-error todo update type
    Editor,
    reducer,
    utils.createExtendedState(),
);

export default {
    ...meta,
    title: 'ARB STIP Grantee',
    argTypes: {
        ...meta.argTypes,
        onExport: { control: { type: 'action' } },
        onClose: { control: { type: 'action' } },
    },
};

export { DocumentModel };
