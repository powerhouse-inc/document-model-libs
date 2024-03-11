import { EditorProps } from 'document-model/document';
import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
} from '../../document-models/arb-ltip-grantee';
import { RWATabsProps } from '@powerhousedao/design-system';
import { useMemo, useState } from 'react';
import './style.css';
import GranteeForm from './components/GranteeForm';
import GranteeDisplay from './components/GranteeDisplay';

export type CustomEditorProps = Pick<
    RWATabsProps,
    'onClose' | 'onExport' | 'onSwitchboardLinkClick'
>;

export type IProps = EditorProps<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState
>;

const Editor = (props: IProps) => {
    const { document } = props;
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        disbursementContractAddress,
        fundingAddress,
        fundingType,
        grantSummary,
        granteeName,
    } = document.state.global;
    const isValid = useMemo(() => {
        if (!disbursementContractAddress) {
            return false;
        }

        if (!fundingAddress) {
            return false;
        }

        if (!fundingType) {
            return false;
        }

        if (!grantSummary) {
            return false;
        }

        if (!granteeName) {
            return false;
        }

        return true;
    }, [
        disbursementContractAddress,
        fundingAddress,
        fundingType,
        grantSummary,
        granteeName,
    ]);

    return (
        <div className="w-full">
            {!isValid || isEditMode ? (
                <GranteeForm
                    {...document.state.global}
                    editorContext={props.editorContext}
                    dispatch={props.dispatch}
                    onClose={() => setIsEditMode(false)}
                />
            ) : (
                <GranteeDisplay
                    {...document.state.global}
                    onEdit={() => setIsEditMode(true)}
                />
            )}
        </div>
    );
};

export default Editor;
