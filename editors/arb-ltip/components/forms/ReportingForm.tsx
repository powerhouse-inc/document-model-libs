import { useCallback, useMemo, useState } from 'react';
import {
    ArbLtipGranteeState,
    GranteeActuals,
    Phase,
} from '../../../../document-models/arb-ltip-grantee';
import { IProps } from '../../editor';
import validators from '../../../../document-models/arb-ltip-grantee/src/validators';
import {
    calculateArbReceived,
    classNames,
    intHandler,
    toArray,
} from '../../util';
import ContractSelector from '../ContractSelector';
import { editPhase } from '../../../../document-models/arb-ltip-grantee/gen/creators';
import PhaseTimespan from '../PhaseTimespan';
import useInitialScroll from '../../hooks/use-initial-scroll';

type ReportingFormProps = Pick<IProps, 'context' | 'dispatch'> & {
    phase: Phase;
    phaseIndex: number;
    state: ArbLtipGranteeState;
};
const ReportingForm = (props: ReportingFormProps) => {
    const { dispatch, phase, phaseIndex, state } = props;
    const actuals = phase.actuals!;

    const [showErrors, setShowErrors] = useState(
        Date.now() >= new Date(phase.endDate).getTime(),
    );
    const [arbReceivedLocal, setArbReceivedLocal] = useState(
        actuals.arbReceived ?? 0,
    );
    const [arbUtilizedLocal, setArbUtilizedLocal] = useState(
        actuals.arbUtilized ?? 0,
    );
    const [contractsLocal, setContractsLocal] = useState(
        toArray(actuals.contractsIncentivized),
    );
    const [disclosuresLocal, setDisclosuresLocal] = useState(
        actuals.disclosures ?? '',
    );
    const [summaryLocal, setSummaryLocal] = useState(actuals.summary ?? '');
    const isArbReceivedValid = useMemo(
        () => validators.gteZero(arbReceivedLocal),
        [arbReceivedLocal],
    );
    const isArbUtilizedValid = useMemo(
        () => validators.gteZero(arbUtilizedLocal),
        [arbUtilizedLocal],
    );
    const isContractsValid = useMemo(
        () => validators.isNotEmpty(contractsLocal),
        [contractsLocal],
    );
    const isDisclosuresValid = useMemo(
        () => validators.isNotEmptyString(disclosuresLocal),
        [disclosuresLocal],
    );
    const isSummaryValid = useMemo(
        () => validators.isNotEmptyString(summaryLocal),
        [summaryLocal],
    );
    const isValid = useMemo(
        () =>
            isArbReceivedValid &&
            isArbUtilizedValid &&
            isContractsValid &&
            isDisclosuresValid &&
            isSummaryValid,
        [
            isArbReceivedValid,
            isArbUtilizedValid,
            isContractsValid,
            isDisclosuresValid,
            isSummaryValid,
        ],
    );

    const arbRemaining = useMemo(() => {
        return (
            (state.grantSize || 0) - calculateArbReceived(toArray(state.phases))
        );
    }, [state.grantSize, state.phases]);

    const dueDate = useMemo(() => {
        const date = new Date(phase.endDate);

        // nice date string
        return date.toLocaleDateString();
    }, [phase.endDate]);

    const description = isValid ? (
        <div>
            The information looks good! Waiting for{' '}
            <span className="font-bold">{dueDate}</span> to collect final
            statistics.
        </div>
    ) : (
        <div>
            While the two-week phase is ongoing, please track the project
            actuals here. This information should be submitted by
            <span className="font-bold">&nbsp;{dueDate}</span>.
        </div>
    );

    useInitialScroll();

    const submit = useCallback(() => {
        const actuals: GranteeActuals = {
            arbReceived: arbReceivedLocal,
            arbUtilized: arbUtilizedLocal,
            arbRemaining: arbRemaining,
            contractsIncentivized: contractsLocal,
            disclosures: disclosuresLocal,
            summary: summaryLocal,
        };

        dispatch(
            editPhase({
                phaseIndex,
                actuals,
            }),
        );
    }, [
        dispatch,
        arbReceivedLocal,
        arbUtilizedLocal,
        arbRemaining,
        contractsLocal,
        disclosuresLocal,
        summaryLocal,
    ]);

    const wrapperClasses = useCallback(
        (isValid: boolean) =>
            classNames(
                showErrors && !isValid
                    ? 'ring-2 ring-red-300'
                    : 'ring-1 ring-gray-300',
                'relative rounded-md !rounded-b-none !rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
            ),
        [showErrors],
    );

    return (
        <div className="w-full">
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <PhaseTimespan phase={phase} />
                <div className="text-lg px-4 py-4 ring-1 ring-inset ring-gray-300">
                    {description}
                </div>
                <div className="relative rounded-md !rounded-t-none !rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 flex">
                    <div
                        className={classNames(
                            showErrors && !isArbReceivedValid
                                ? 'ring-2 ring-red-300'
                                : '',
                            'flex-1 relative rounded-md !rounded-b-none !rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
                        )}
                    >
                        <label className="block text-xs font-medium text-gray-900">
                            ARB Received (required)
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Enter amount"
                            value={arbReceivedLocal}
                            onChange={intHandler(setArbReceivedLocal)}
                        />
                    </div>
                    <div
                        className={classNames(
                            showErrors && !isArbUtilizedValid
                                ? 'ring-2 ring-red-300'
                                : '',
                            'flex-1 relative rounded-md !rounded-b-none !rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
                        )}
                    >
                        <label className="block text-xs font-medium text-gray-900">
                            ARB Utilized (required)
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Enter amount"
                            value={arbUtilizedLocal}
                            onChange={intHandler(setArbUtilizedLocal)}
                        />
                    </div>
                    <div className="flex-1 relative rounded-md !rounded-b-none !rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                        <label className="block text-xs font-medium text-gray-900">
                            ARB Remaining
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            value={arbRemaining}
                            readOnly
                        />
                    </div>
                </div>
                <div className={wrapperClasses(isContractsValid)}>
                    <label className="block text-xs font-medium text-gray-900">
                        Contracts Incentivized (required)
                    </label>
                    <ContractSelector
                        contracts={contractsLocal}
                        onAdd={contract =>
                            setContractsLocal([...contractsLocal, contract])
                        }
                        onRemove={id =>
                            setContractsLocal(
                                contractsLocal.filter(c => c.contractId !== id),
                            )
                        }
                    />
                </div>
                <div className={wrapperClasses(isDisclosuresValid)}>
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Disclosures (required)
                    </label>
                    <textarea
                        rows={4}
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter disclosures here"
                        value={disclosuresLocal}
                        onChange={e => setDisclosuresLocal(e.target.value)}
                    />
                </div>
                <div className={wrapperClasses(isSummaryValid)}>
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Summary (required)
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter summary here"
                        value={summaryLocal}
                        onChange={e => setSummaryLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={submit}
            >
                Update
            </button>
        </div>
    );
};

export default ReportingForm;