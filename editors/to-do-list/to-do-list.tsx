import React from 'react';
import {
    DocumentEditor,
    EditorWorksheet,
    TextInput,
} from 'document-model-libs/utils';
import { EditorProps } from 'document-model/document';
import {
    ToDoItem,
    ToDoListState,
    ToDoListAction,
    ToDoListLocalState,
    actions,
} from '../../document-models/to-do-list';

export type IProps = EditorProps<
    ToDoListState,
    ToDoListAction,
    ToDoListLocalState
>;

const ToDoList = (props: IProps) => {
    const { document, dispatch, context } = props;
    const {
        state: { global: state },
    } = document;

    // Sort items by checked status
    const sortedItems: ToDoItem[] = [...state.items].sort((a, b) => {
        return (b.checked ? 1 : 0) - (a.checked ? 1 : 0);
    });

    return (
        <DocumentEditor mode={context.theme}>
            <EditorWorksheet>
                <h1>To-do List</h1>
                <TextInput
                    key="doc-title"
                    placeholder="Insert task here..."
                    size="large"
                    theme={context.theme}
                    onSubmit={value => {
                        dispatch(
                            actions.addTodoItem({
                                id: Math.random().toString(),
                                text: value,
                            }),
                        );
                    }}
                />
                <div
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <div style={{ flex: 2 }}>
                        {sortedItems.map((item: ToDoItem, index: number) => (
                            <ul key={index}>
                                <li
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={item.checked}
                                        onClick={() => {
                                            dispatch(
                                                actions.updateTodoItem({
                                                    id: item.id,
                                                    checked: !item.checked,
                                                }),
                                            );
                                        }}
                                    />
                                    <button
                                        style={{
                                            color: 'red',
                                            padding: '0px 5px 0px 5px',
                                        }}
                                        onClick={() => {
                                            dispatch(
                                                actions.deleteTodoItem({
                                                    id: item.id,
                                                }),
                                            );
                                        }}
                                    >
                                        Remove
                                    </button>
                                    <span
                                        style={{
                                            fontSize: '15px',
                                            marginLeft: '10px',
                                        }}
                                    >
                                        {item.text}
                                    </span>
                                </li>
                            </ul>
                        ))}
                    </div>
                    <div style={{ flex: 1, paddingLeft: '10px' }}>
                        <span>Total: {state.stats.total}</span>
                        <br />
                        <span>Checked: {state.stats.checked}</span>
                        <br />
                        <span>Unchecked: {state.stats.unchecked}</span>
                    </div>
                </div>
            </EditorWorksheet>
        </DocumentEditor>
    );
};

export default ToDoList;
