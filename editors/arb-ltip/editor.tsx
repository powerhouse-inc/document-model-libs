import { EditorProps } from 'document-model/document';
import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
} from '../../document-models/arb-ltip-grantee';
import { RWATabsProps } from '@powerhousedao/design-system';
import { TextInput } from 'document-model-editors';
import {
    setGranteeName,
    setGranteeSummary,
} from '../../document-models/arb-ltip-grantee/gen/creators';
import { useCallback, useMemo, useState } from 'react';
import './style.css';

export type CustomEditorProps = Pick<
    RWATabsProps,
    'onClose' | 'onExport' | 'onSwitchboardLinkClick'
>;

type IProps = EditorProps<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState
>;

type GranteeSaveProps = Pick<
    ArbLtipGranteeState,
    | 'disbursementContractAddress'
    | 'fundingAddress'
    | 'fundingType'
    | 'grantSummary'
    | 'granteeName'
>;
type GranteeFormProps = ArbLtipGranteeState &
    Pick<IProps, 'editorContext' | 'dispatch'>;

const GranteeForm = (props: GranteeFormProps) => {
    const {
        editorContext,
        dispatch,
        granteeName,
        metricsDashboardLink,
        grantSummary,
        disbursementContractAddress,
        fundingAddress,
        fundingType,
    } = props;

    const [granteeNameLocal, setGranteeNameLocal] = useState(granteeName || '');
    const [
        disbursementContractAddressLocal,
        setDisbursementContractAddressLocal,
    ] = useState(disbursementContractAddress || '');
    const [fundingAddressLocal, setFundingAddressLocal] = useState(
        fundingAddress || '',
    );
    const [fundingTypeLocal, setFundingTypeLocal] = useState(fundingType);
    const [grantSummaryLocal, setGrantSummaryLocal] = useState(
        grantSummary || '',
    );

    const onSetGranteeName = useCallback(
        (name: string) => {
            setGranteeNameLocal(name);
            dispatch(setGranteeName({ granteeName: name }));
        },
        [dispatch, granteeNameLocal],
    );

    const onSubmit = useCallback(() => {
        dispatch(
            setGranteeSummary({
                disbursementContractAddress: disbursementContractAddressLocal,
                fundingAddress: fundingAddressLocal,
                fundingType: [],
                grantSummary: grantSummaryLocal,
            }),
        );
    }, [
        dispatch,
        disbursementContractAddressLocal,
        fundingAddressLocal,
        grantSummaryLocal,
    ]);

    return (
        <div className="w-full">
            <div>
                <TextInput
                    key="grantee-name"
                    value={granteeNameLocal}
                    size="huge"
                    placeholder="Grantee Name"
                    theme={editorContext.theme}
                    onSubmit={onSetGranteeName}
                    autoFocus
                />
            </div>
            <div className="flex flex-col">
                <div className="flex h-12 items-top">
                    <p className="w-52 px-2 pt-1">Summary:</p>
                    <div className="flex-1">
                        <TextInput
                            key="grant-summary"
                            value={grantSummaryLocal}
                            size="small"
                            placeholder="Summary description"
                            theme={editorContext.theme}
                            onSubmit={setGrantSummaryLocal}
                        />
                    </div>
                </div>
                <div className="flex h-12">
                    <p className="w-52 px-2 pt-1">Disbursement Address:</p>
                    <div className="flex-1">
                        <TextInput
                            key="disbursement-address"
                            value={disbursementContractAddressLocal}
                            size="small"
                            placeholder="Contract address"
                            theme={editorContext.theme}
                            onSubmit={setDisbursementContractAddressLocal}
                        />
                    </div>
                </div>
                <div className="flex h-12">
                    <p className="w-52 px-2 pt-1">Funding Address:</p>
                    <div className="flex-1">
                        <TextInput
                            key="funding-address"
                            value={fundingAddressLocal}
                            size="small"
                            placeholder="Funding address"
                            theme={editorContext.theme}
                            onSubmit={setFundingAddressLocal}
                        />
                    </div>
                </div>
                <div className="flex h-12">
                    <p className="w-52 px-2 pt-1">Funding Type:</p>
                    <div className="flex-1"></div>
                </div>
                <div className="flex h-12">
                    <p className="w-52 px-2 pt-1">Metrics Dashboard Link:</p>
                    <div className="flex-1">
                        <TextInput
                            key="metrics-dashboard-link"
                            value={''}
                            size="small"
                            placeholder="https://..."
                            theme={editorContext.theme}
                            onSubmit={() => {}}
                        />
                    </div>
                </div>
                <div className="flex w-full px-2 pt-6">
                    <button
                        type="button"
                        className="rounded-md bg-slate-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

type GranteeDisplayProps = ArbLtipGranteeState & { onEdit: () => void };
const GranteeDisplay = (props: GranteeDisplayProps) => {
    return (
        <div>
            <div key="header-left" className="editor-worksheet--header-left">
                <div>{props.granteeName}</div>
                <div>{props.grantSummary}</div>
                <div>{props.metricsDashboardLink}</div>
            </div>
        </div>
    );
};

const Editor = (props: IProps) => {
    const { document } = props;
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        disbursementContractAddress,
        fundingAddress,
        fundingType,
        grantSummary,
        granteeName,
        metricsDashboardLink,
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
