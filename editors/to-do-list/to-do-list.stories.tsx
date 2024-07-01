import { createDocumentStory } from 'document-model-libs/utils';
import { reducer, utils } from '../../document-models/to-do-list';
import Editor from './to-do-list';

const { meta, CreateDocumentStory: ToDoList } = createDocumentStory(
    Editor,
    reducer,
    utils.createExtendedState(),
);

export default {
    ...meta,
    title: 'ToDoList',
    parameters: {
        date: new Date('June 21, 2024 10:00:00'),
    },
};

export { ToDoList };
