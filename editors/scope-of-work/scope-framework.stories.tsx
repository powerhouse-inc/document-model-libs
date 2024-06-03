import { createDocumentStory } from 'document-model-libs/utils';
import { reducer, utils } from '../../document-models/scope-of-work';
import Editor from './editor';

const { meta, CreateDocumentStory: ScopeOfWork } = createDocumentStory(
    Editor,
    reducer,
    utils.createExtendedState({
        lastModified: '2021-03-10T10:00:00.000Z',
    }),
);

export default {
    ...meta,
    title: 'Scope of Work',
    parameters: {
        date: new Date('March 10, 2021 10:00:00'),
    },
};

export { ScopeOfWork };
