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

    const handleCreateDeliverable = (title: string) => {
        dispatch(actions.createDeliverable({
            id: randomId(),
            title: title,
            keyResults: [],
            status: 'TODO',
            owner: {
                id: randomId(),
                ref: '',
                code: 'UBQ-001',
                name: 'Ubiquity DAO'
            },
            budgetAnchor: {
                project: randomId(),
                deliverableBudget: 25.00,
                workUnitBudget: 1
            }
        }));
    }

    return (
        <DocumentEditor mode={context.theme}>
            <EditorToolbar
                key="toolbar" left={[]} center={[]} right={[]}
            />
            <EditorWorksheet key="sheet">
                <label>Add deliverable:</label>
                <TextInput
                    key="doc-title"
                    value={document.name}
                    size="medium"
                    theme={context.theme}
                    onSubmit={handleCreateDeliverable}
                />

                <table className='sow-deliverables-table'>
                    {state.deliverables.map(d => (
                        <tr>
                            <td>{d.title}</td>
                            <td>{d.status}</td>
                            <td><input type="checkbox"/></td>
                        </tr>
                    ))}
                </table>

            </EditorWorksheet>
        </DocumentEditor>
    );
}

export default ScopeOfWorkEditor;
