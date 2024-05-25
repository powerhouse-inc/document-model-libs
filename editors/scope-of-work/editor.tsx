import {
    DocumentEditor,
    EditorToolbar,
    EditorWorksheet,
    TextInput,
    ToolbarButton,
} from 'document-model-libs/utils';
import { EditorProps } from 'document-model/document';
import {
    ScopeOfWorkAction,
    ScopeOfWorkLocalState,
    ScopeOfWorkState,
    actions,
} from '../../document-models/scope-of-work';
import './style.css';

export type IProps = EditorProps<
    ScopeOfWorkState,
    ScopeOfWorkAction,
    ScopeOfWorkLocalState
>;

export const randomId = () => {
    return Math.floor(Math.random() * Date.now()).toString(36);
};

function doNothing(message:string) {
    return () => console.log(`${message} and did nothing`);
}

function ScopeOfWorkEditor(props: IProps) {
    const { document, dispatch, context } = props;
    const {
        state: { global: state },
    } = document;

    return (
        <DocumentEditor mode={context.theme}>
            <EditorToolbar
                key="toolbar"
                left={[
                    <ToolbarButton
                        key="undo"
                        onClick={() => dispatch(actions.undo(1))}
                    >
                        ↺ undo
                    </ToolbarButton>,
                    <ToolbarButton
                        key="redo"
                        onClick={() => dispatch(actions.redo(1))}
                    >
                        ↻ redo
                    </ToolbarButton>,
                ]}
                center={[
                    <ToolbarButton key="art" onClick={doNothing("Clicked add article")}>
                        ＋ add article
                    </ToolbarButton>,
                    <ToolbarButton key="sct" onClick={doNothing("Clicked add section")}>
                        ＋ add section
                    </ToolbarButton>,
                    <ToolbarButton key="cor" onClick={doNothing("Clicked add core")}>
                        ＋ add core
                    </ToolbarButton>,
                ]}
                right={[
                    <ToolbarButton key="rev">revision history</ToolbarButton>,
                ]}
            />
            <EditorWorksheet key="sheet">
                <div
                    key="header-left"
                    className="editor-worksheet--header-left"
                >
                    <TextInput
                        key="doc-title"
                        value={document.name}
                        size="huge"
                        theme={context.theme}
                        onSubmit={doNothing("Submitted doc title")}
                    />
                    <p key="lastModified">
                        Last Modified:{' '}
                        {document.lastModified
                            .toString()
                            .slice(0, 16)
                            .replace('T', ' ')}{' '}
                        UTC &ndash; Version: {document.revision.global}
                    </p>
                </div>
                <div
                    key="header-right"
                    className="editor-worksheet--header-right"
                >
                    <TextInput
                        key="doc-title"
                        value={state.deliverables.length + " deliverables"}
                        size="medium"
                        theme={context.theme}
                        onSubmit={doNothing("Submitted doc title")}
                    />
                </div>
            </EditorWorksheet>
        </DocumentEditor>
    );
}

export default ScopeOfWorkEditor;
