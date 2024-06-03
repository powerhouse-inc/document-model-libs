import {
    DocumentEditor,
    EditorToolbar,
    EditorWorksheet,
    TextInput,
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

    const handleDeleteDeliverable = (id: string) => {
        dispatch(actions.deleteDeliverable({ id }));
    }

    const handleToggleStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            dispatch(actions.updateDeliverableStatus({
                id: event.target.value,
                status: 'DELIVERED'
            }));
        
        } else {
            dispatch(actions.updateDeliverableStatus({
                id: event.target.value,
                status: 'TODO'
            }));
        }
    }

    const handleSetDocumentName = (name: string) => {
        dispatch(actions.setName(name));
    };

    return (
        <DocumentEditor mode={context.theme}>
            <EditorToolbar
                key="toolbar" left={[]} center={[]} right={[]}
            />
            <EditorWorksheet key="sheet">
                <TextInput
                        key="doc-title"
                        value={document.name}
                        size="huge"
                        theme={context.theme}
                        onSubmit={handleSetDocumentName}
                    />
                
                <label>Add a deliverable:</label>
                
                <TextInput
                    key="new-deliverable-title"
                    size="medium"
                    theme={context.theme}
                    onSubmit={handleCreateDeliverable}
                    clearOnSubmit={true}
                    autoFocus={true}
                />

                <table className='sow-deliverables-table'>
                    <tbody>
                    {state.deliverables.map(d => (
                        <tr key={d.id}>
                            <td key="checkbox">
                                <input 
                                    value={d.id} 
                                    type="checkbox" 
                                    onChange={handleToggleStatus}
                                    checked={d.status == 'DELIVERED'}
                                    />
                            </td>
                            <td key="title">{d.title}</td>
                            <td key="status">
                                <span className={[
                                    'sow-deliverables-status',
                                    'sow-deliverables-status--' + d.status.toLowerCase()
                                ].join(' ')}>{d.status}</span>
                            </td>
                            <td key="actions" className="sow-deliverables-table--columnActions">
                                <button className="sow-deliverables-delete" onClick={() => handleDeleteDeliverable(d.id)}>
                                    &times;
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </EditorWorksheet>
        </DocumentEditor>
    );
}

export default ScopeOfWorkEditor;
