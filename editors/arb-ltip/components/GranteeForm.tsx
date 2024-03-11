import {
    ArbLtipGranteeState,
    FundingType,
} from '../../../document-models/arb-ltip-grantee';
import { TextInput } from 'document-model-editors';
import {
    setGranteeMetrics,
    setGranteeName,
    setGranteeSummary,
} from '../../../document-models/arb-ltip-grantee/gen/creators';
import { useCallback, useMemo, useState } from 'react';
import { maybeToArray } from '../util';
import FundingTypeTagSelector from './TagSelector';
import { IProps } from '../editor';
import TagSelector from './TagSelector';

const fundingTypes = [
    {
        name: 'EOA',
        value: 'EOA',
    },
    {
        name: 'Multisig',
        value: 'Multisig',
    },
    {
        name: '3/5 Multisig',
        value: 'ThreeofFiveMultisig',
    },
    {
        name: '2/3 Multisig',
        value: 'TwoofThreeMultisig',
    },
];

type GranteeFormProps = ArbLtipGranteeState &
    Pick<IProps, 'editorContext' | 'dispatch'> & { onClose: () => void };

const GranteeForm = (props: GranteeFormProps) => {
    const {
        editorContext,
        dispatch,
        onClose,
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
    const [fundingTypeLocal, setFundingTypeLocal] = useState(
        maybeToArray(fundingType),
    );
    const [grantSummaryLocal, setGrantSummaryLocal] = useState(
        grantSummary || '',
    );
    const [metricsDashboardLinkLocal, setMetricsDashboardLinkLocal] = useState(
        metricsDashboardLink || '',
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

        dispatch(
            setGranteeMetrics({
                metricsDashboardLink: metricsDashboardLinkLocal,
            }),
        );

        onClose();
    }, [
        dispatch,
        disbursementContractAddressLocal,
        fundingAddressLocal,
        grantSummaryLocal,
        metricsDashboardLinkLocal,
        onClose,
    ]);

    const isValid = useMemo(() => {
        if (!disbursementContractAddressLocal) {
            return false;
        }

        if (!fundingAddressLocal) {
            return false;
        }

        if (!fundingTypeLocal) {
            return false;
        }

        if (!grantSummaryLocal) {
            return false;
        }

        if (!granteeNameLocal) {
            return false;
        }

        return true;
    }, [
        disbursementContractAddressLocal,
        fundingAddressLocal,
        fundingTypeLocal,
        grantSummaryLocal,
        granteeNameLocal,
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
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <div className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Disbursement Address (required)
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="0x..."
                        value={disbursementContractAddressLocal}
                        onChange={e =>
                            setDisbursementContractAddressLocal(e.target.value)
                        }
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Funding Address (required)
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="0x..."
                        value={fundingAddressLocal}
                        onChange={e => setFundingAddressLocal(e.target.value)}
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Metrics Dashboard Link
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="https://example.com"
                        value={metricsDashboardLinkLocal}
                        onChange={e =>
                            setMetricsDashboardLinkLocal(e.target.value)
                        }
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Funding Type(s) (required)
                    </label>
                    <TagSelector
                        value={fundingTypeLocal}
                        schema={fundingTypes}
                        onAdd={value => {
                            setFundingTypeLocal([
                                ...fundingTypeLocal,
                                value as FundingType,
                            ]);
                        }}
                        onRemove={value => {
                            setFundingTypeLocal(
                                fundingTypeLocal.filter(v => v !== value),
                            );
                        }}
                    />
                </div>
                <div className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Grant Summary (required)
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter grant summary here"
                        defaultValue={''}
                        value={grantSummaryLocal}
                        onChange={e => setGrantSummaryLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={!isValid}
                onClick={onSubmit}
            >
                Save
            </button>
        </div>
    );
};

export default GranteeForm;
