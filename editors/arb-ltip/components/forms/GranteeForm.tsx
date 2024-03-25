import {
    ArbLtipGranteeState,
    FundingType,
    actions,
} from '../../../../document-models/arb-ltip-grantee';
import { TextInput } from 'document-model-libs/utils';
import { useCallback, useMemo, useState } from 'react';
import { classNames, maybeToArray } from '../../util';
import DatePicker from 'react-datepicker';
import { IProps } from '../../editor';
import TagSelector from '../TagSelector';
import { InitGranteeInput } from '../../../../document-models/arb-ltip-grantee/gen';
import validators from '../../../../document-models/arb-ltip-grantee/src/validators';

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

    const [showErrors, setShowErrors] = useState(false);
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
    const [grantSizeLocal, setGrantSizeLocal] = useState(0);
    const [matchingGrantSizeLocal, setMatchingGrantSizeLocal] = useState(0);

    // 12 weeks
    const [startDate, setStartDate] = useState(new Date(2024, 3, 27));
    const endDate = useMemo(() => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + 84);
        return date;
    }, [startDate]);

    const isDisbursementContractAddressValid = useMemo(
        () => validators.isValidAddress(disbursementContractAddressLocal),
        [disbursementContractAddressLocal],
    );
    const isFundingAddressValid = useMemo(
        () => validators.isValidAddress(fundingAddressLocal),
        [fundingAddressLocal],
    );
    const isGrantSizeValid = useMemo(
        () => validators.gteZero(grantSizeLocal),
        [grantSizeLocal],
    );
    const isMatchingGrantSizeValid = useMemo(
        () => validators.gteZero(matchingGrantSizeLocal),
        [matchingGrantSizeLocal],
    );
    const isFundingTypeValid = useMemo(
        () => validators.isNotEmpty(fundingTypeLocal),
        [fundingTypeLocal],
    );
    const isGrantSummaryValid = useMemo(
        () => validators.isNotEmptyString(grantSummaryLocal),
        [grantSummaryLocal],
    );
    const isFormValid = useMemo(
        () =>
            isDisbursementContractAddressValid &&
            isFundingAddressValid &&
            isGrantSizeValid &&
            isMatchingGrantSizeValid &&
            isFundingTypeValid &&
            isGrantSummaryValid,
        [
            isDisbursementContractAddressValid,
            isFundingAddressValid,
            isGrantSizeValid,
            isMatchingGrantSizeValid,
            isFundingTypeValid,
            isGrantSummaryValid,
        ],
    );

    const onSubmit = useCallback(() => {
        if (!isFormValid) {
            setShowErrors(true);

            return;
        }

        const input: InitGranteeInput = {
            disbursementContractAddress: disbursementContractAddressLocal,
            fundingAddress: fundingAddressLocal,
            fundingType: fundingTypeLocal,
            grantSize: grantSizeLocal,
            granteeName: granteeNameLocal,
            matchingGrantSize: matchingGrantSizeLocal,
            grantSummary: grantSummaryLocal,
            metricsDashboardLink: metricsDashboardLinkLocal,
            numberOfPhases: 8,
            phaseDuration: 14,
            startDate: startDate.toISOString(),
        };

        dispatch(actions.initGrantee(input));

        onClose();
    }, [
        disbursementContractAddressLocal,
        fundingAddressLocal,
        fundingTypeLocal,
        grantSummaryLocal,
        granteeNameLocal,
        metricsDashboardLinkLocal,
        grantSizeLocal,
        matchingGrantSizeLocal,
        startDate,
        isFormValid,
    ]);

    const wrapperClasses = useCallback(
        (isValid: boolean, classes = '') =>
            classNames(
                showErrors && !isValid
                    ? 'ring-2 ring-red-300'
                    : 'ring-1 ring-gray-300',
                classes,
                'relative rounded-md !rounded-b-none !rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
            ),
        [showErrors],
    );

    return (
        <div className="w-full">
            <div>
                <TextInput
                    value={granteeNameLocal}
                    size="huge"
                    placeholder="Grantee Name"
                    theme={editorContext.theme}
                    onSubmit={setGranteeNameLocal}
                    autoFocus
                />
            </div>
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <div className={wrapperClasses(true, 'flex')}>
                    <div>
                        <label className="block text-xs font-medium text-gray-900">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDate}
                            className="py-2 px-3 border border-gray-600 group-focus-within:border-purple-600 outline-none"
                            onChange={date => {
                                if (!date) {
                                    return;
                                }

                                setStartDate(date);
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-900">
                            End Date
                        </label>
                        <DatePicker
                            selected={endDate}
                            className="py-2 px-3 border border-gray-600 bg-white outline-none"
                            onChange={() => {}}
                            disabled={true}
                        />
                    </div>
                </div>
                <div
                    className={wrapperClasses(
                        isGrantSizeValid && isMatchingGrantSizeValid,
                        'flex',
                    )}
                >
                    <div>
                        <label className="block text-xs font-medium text-gray-900">
                            Grant Size (required)
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="0"
                            value={grantSizeLocal}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                if (isNaN(value)) {
                                    return;
                                }

                                setGrantSizeLocal(value);
                            }}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-900">
                            Matching Grant Size (required)
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="0"
                            value={matchingGrantSizeLocal}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                if (isNaN(value)) {
                                    return;
                                }

                                setMatchingGrantSizeLocal(value);
                            }}
                        />
                    </div>
                </div>
                <div
                    className={wrapperClasses(
                        isDisbursementContractAddressValid,
                    )}
                >
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
                <div className={wrapperClasses(isFundingAddressValid)}>
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
                <div className="relative rounded-md !rounded-t-none !rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
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
                <div className={wrapperClasses(isFundingTypeValid)}>
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
                <div className={wrapperClasses(isGrantSummaryValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Grant Summary (required)
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter grant summary here"
                        value={grantSummaryLocal}
                        onChange={e => setGrantSummaryLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={onSubmit}
            >
                Save
            </button>
        </div>
    );
};

export default GranteeForm;
