import { EditorProps } from 'document-model/document';
import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
} from '../../document-models/arb-ltip-grantee';
import { RWATabsProps } from '@powerhousedao/design-system';

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
>;

const GranteeForm = (props: GranteeFormProps) => {
    return <div>Hello.</div>;
};

const Editor = (props: IProps) => {
    const { document, editorContext, dispatch } = props;

    return (
        <div>
            <GranteeForm {...document.state.global} />
        </div>
    );
};

export default Editor;
