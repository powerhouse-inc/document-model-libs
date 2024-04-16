import {
    ArbLtipGranteeState,
    EditGranteeInput,
    FundingType,
    InitGranteeInput,
    actions,
} from '../../../../document-models/arb-ltip-grantee';
import { useCallback, useMemo, useState } from 'react';
import { classNames, maybeToArray } from '../../util';
import DatePicker from 'react-datepicker';
import { IProps } from '../../editor';
import TagSelector from '../TagSelector';
import validators from '../../../../document-models/arb-ltip-grantee/src/validators';
import { useIsAdmin } from '../UserProvider';

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

const numPhases = 8;
const phaseDuration = 14;

type GranteeFormProps = ArbLtipGranteeState &
    Pick<IProps, 'context' | 'dispatch'> & { onClose: () => void };

const GranteeForm = (props: GranteeFormProps) => {
    const {
        dispatch,
        onClose,
        granteeName,
        metricsDashboardLink,
        grantSummary,
        authorizedSignerAddress,
        disbursementContractAddress,
        fundingAddress,
        fundingType,
        grantSize,
        matchingGrantSize,
    } = props;

    const [showErrors, setShowErrors] = useState(false);
    const [granteeNameLocal, setGranteeNameLocal] = useState(granteeName || '');
    const [
        disbursementContractAddressLocal,
        setDisbursementContractAddressLocal,
    ] = useState(disbursementContractAddress || '');
    const [authorizedSignerAddressLocal, setAuthorizedSignerAddressLocal] =
        useState(authorizedSignerAddress || '');
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
    const [grantSizeLocal, setGrantSizeLocal] = useState(grantSize || 0);
    const [matchingGrantSizeLocal, setMatchingGrantSizeLocal] = useState(
        matchingGrantSize || 0,
    );

    // 12 weeks
    const [startDate, setStartDate] = useState(new Date(2024, 3, 29));
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

    const isInit = authorizedSignerAddress === '';
    const isAdmin = useIsAdmin();

    const onSubmit = useCallback(() => {
        if (!isFormValid) {
            setShowErrors(true);

            return;
        }

        if (isInit) {
            dispatch(
                actions.initGrantee({
                    fundingAddress: fundingAddressLocal,
                    fundingType: fundingTypeLocal,
                    granteeName: granteeNameLocal,
                    grantSummary: grantSummaryLocal,
                    metricsDashboardLink: metricsDashboardLinkLocal,
                    startDate: startDate.toISOString(),
                    grantSize: grantSizeLocal,
                    matchingGrantSize: matchingGrantSizeLocal,
                    authorizedSignerAddress: authorizedSignerAddressLocal,
                    disbursementContractAddress:
                        disbursementContractAddressLocal,
                    numberOfPhases: numPhases,
                    phaseDuration: phaseDuration,
                }),
            );
        } else {
            const input: EditGranteeInput = {
                fundingAddress: fundingAddressLocal,
                fundingType: fundingTypeLocal,
                granteeName: granteeNameLocal,
                grantSummary: grantSummaryLocal,
                metricsDashboardLink: metricsDashboardLinkLocal,
            };

            if (isAdmin) {
                input.grantSize = grantSizeLocal;
                input.matchingGrantSize = matchingGrantSizeLocal;
                input.authorizedSignerAddress = authorizedSignerAddressLocal;
                input.disbursementContractAddress =
                    disbursementContractAddressLocal;
            }

            dispatch(actions.editGrantee(input));
        }

        onClose();
    }, [
        isAdmin,
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
                'rounded-md !rounded-b-none !rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
            ),
        [showErrors],
    );

    return (
        <div className="w-full">
            <div className="mt-4">
                <input
                    type="text"
                    className="w-full rounded-md !rounded-b-none px-2 text-gray-900 placeholder:text-gray-400 text-4xl ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600"
                    placeholder="Grantee Name"
                    autoFocus
                    value={granteeNameLocal}
                    onChange={e => setGranteeNameLocal(e.target.value)}
                />
            </div>
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <div className={wrapperClasses(true, 'flex')}>
                    <div className="w-40">
                        <label className="text-xs font-medium text-gray-900">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDate}
                            disabled={!isAdmin && !isInit}
                            className="w-32 py-2 outline-none cursor-pointer text-sm"
                            onChange={date => {
                                if (!date) {
                                    return;
                                }

                                if (isAdmin || isInit) {
                                    setStartDate(date);
                                }
                            }}
                        />
                    </div>
                    <div className="w-40">
                        <label className="text-xs font-medium text-gray-900">
                            End Date
                        </label>
                        <DatePicker
                            selected={endDate}
                            className="w-32 py-2 outline-none cursor-not-allowed text-sm"
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
                    <div className="w-40">
                        <label className="text-xs font-medium text-gray-900">
                            Grant Size
                        </label>
                        <input
                            type="text"
                            className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                            placeholder="0"
                            disabled={!isAdmin && !isInit}
                            value={grantSizeLocal}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                if (isNaN(value)) {
                                    return;
                                }

                                if (isAdmin || isInit) {
                                    setGrantSizeLocal(value);
                                }
                            }}
                        />
                    </div>

                    <div className="w-40">
                        <label className="text-xs font-medium text-gray-900">
                            Matching Grant Size
                        </label>
                        <input
                            type="text"
                            className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                            placeholder="0"
                            disabled={!isAdmin && !isInit}
                            value={matchingGrantSizeLocal}
                            onChange={e => {
                                const value = parseInt(e.target.value, 10);
                                if (isNaN(value)) {
                                    return;
                                }

                                if (isAdmin || isInit) {
                                    setMatchingGrantSizeLocal(value);
                                }
                            }}
                        />
                    </div>
                </div>
                <div className={wrapperClasses(true)}>
                    <label className="text-xs font-medium text-gray-900">
                        Authorized Signer Address
                    </label>
                    <input
                        type="text"
                        className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                        placeholder="0x..."
                        disabled={!isAdmin && !isInit}
                        value={authorizedSignerAddressLocal}
                        onChange={e => {
                            if (isAdmin || isInit) {
                                setAuthorizedSignerAddressLocal(e.target.value);
                            }
                        }}
                    />
                </div>
                <div
                    className={wrapperClasses(
                        isDisbursementContractAddressValid,
                    )}
                >
                    <label className="text-xs font-medium text-gray-900">
                        Disbursement Address
                    </label>
                    <input
                        type="text"
                        className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                        placeholder="0x..."
                        disabled={!isAdmin && !isInit}
                        value={disbursementContractAddressLocal}
                        onChange={e => {
                            if (isAdmin || isInit) {
                                setDisbursementContractAddressLocal(
                                    e.target.value,
                                );
                            }
                        }}
                    />
                </div>
                <div className={wrapperClasses(isFundingAddressValid)}>
                    <label className="text-xs font-medium text-gray-900">
                        Funding Address
                    </label>
                    <input
                        type="text"
                        className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                        placeholder="0x..."
                        value={fundingAddressLocal}
                        onChange={e => setFundingAddressLocal(e.target.value)}
                    />
                </div>
                <div className="rounded-md !rounded-t-none !rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="text-xs font-medium text-gray-900">
                        Metrics Dashboard Link (optional)
                    </label>
                    <input
                        type="text"
                        className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
                        placeholder="https://example.com"
                        value={metricsDashboardLinkLocal}
                        onChange={e =>
                            setMetricsDashboardLinkLocal(e.target.value)
                        }
                    />
                </div>
                <div className={wrapperClasses(isFundingTypeValid)}>
                    <label className="text-xs font-medium text-gray-900 mb-1">
                        Funding Type(s)
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
                    <label className="text-xs font-medium text-gray-900">
                        Grant Summary
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 text-sm sm:leading-6"
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
