import { EditorProps } from 'document-model/document';
import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
} from '../../document-models/arb-ltip-grantee';
import { RWATabsProps } from '@powerhousedao/design-system';
import { TextInput } from 'document-model-editors';
import { setGranteeName } from '../../document-models/arb-ltip-grantee/gen/creators';

export type CustomEditorProps = Pick<
    RWATabsProps,
    'onClose' | 'onExport' | 'onSwitchboardLinkClick'
>;

type IProps = EditorProps<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState
>;

type GranteeFormProps = Pick<
    ArbLtipGranteeState,
    'id' | 'granteeName' | 'grantSize' | 'grantSummary' | 'metricsDashboardLink'
> &
    Pick<IProps, 'editorContext' | 'dispatch'>;

const GranteeForm = (props: GranteeFormProps) => {
    const { editorContext, dispatch, granteeName } = props;

    const onSetGranteeName = (granteeName: string) => {
        dispatch(setGranteeName({ granteeName }));
    };

    return (
        <div>
            <div key="header-left" className="editor-worksheet--header-left">
                <TextInput
                    key="doc-title"
                    value={granteeName || ''}
                    size="huge"
                    placeholder="Grantee Name"
                    theme={editorContext.theme}
                    onSubmit={onSetGranteeName}
                />
            </div>
        </div>
    );
};

const Editor = (props: IProps) => {
    const { document } = props;

    return (
        <div>
            <GranteeForm {...props} {...document.state.global} />
        </div>
    );
};

export default Editor;
