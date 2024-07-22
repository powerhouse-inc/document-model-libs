import { useCallback, useMemo, useState } from 'react';
import TagSelector from '../TagSelector';
import {
    ArbitrumLtipGranteeState,
    DistributionMechanism,
    GranteeActuals,
    Phase,
    Status,
    isActualsEmpty,
} from '../../../../document-models/arbitrum-ltip-grantee';
import ContractSelector from '../ContractSelector';
import { IProps } from '../../editor';
import 'react-datepicker/dist/react-datepicker.css';
import { editPhase } from '../../../../document-models/arbitrum-ltip-grantee/gen/creators';
import validators from '../../../../document-models/arbitrum-ltip-grantee/src/validators';
import { classNames, intHandler, toArray } from '../../util';
import PhaseTimespan from '../PhaseTimespan';
import useInitialScroll from '../../hooks/use-initial-scroll';
import useAllContracts from '../../hooks/use-all-contracts';
import InfoTooltip from '../InfoTooltip';

const distributionMechanisms = [
    {
        name: 'Airdrop',
        value: 'Airdrop',
    },
    {
        name: 'LP Incentives',
        value: 'LPIncentives',
    },
];

type PlannedResourcesFormProps = Pick<IProps, 'context' | 'dispatch'> & {
    state: ArbitrumLtipGranteeState;
    phase: Phase;
    phaseIndex: number;
    hideDescription?: boolean;
};
const PlannedResourcesForm = (props: PlannedResourcesFormProps) => {
    const { dispatch, phase, phaseIndex, state, hideDescription } = props;
    const planned = phase.planned!;

    // state
    const [showErrors, setShowErrors] = useState(
        Date.now() >= new Date(phase.startDate).getTime(),
    );

    const [disbursementAmountLocal, setDisbursementAmountLocal] = useState(
        planned.arbToBeDistributed || 0,
    );
    const [distributionMechanismsLocal, setDistributionMechanismsLocal] =
        useState(toArray(planned.distributionMechanism));
    const [contractsLocal, setContractsLocal] = useState(
        toArray(planned.contractsIncentivized),
    );
    const [expectationsLocal, setExpectationsLocal] = useState(
        planned.expectations || '',
    );
    const [changesLocal, setChangesLocal] = useState(planned.changes || '');

    // derived
    const allContracts = useAllContracts(state);
    const startDate = useMemo(
        () => new Date(phase.startDate),
        [phase.startDate],
    );
    const endDate = useMemo(() => new Date(phase.endDate), [phase.endDate]);

    const isValid = useMemo(
        () => validators.isPlannedValid(planned),
        [planned],
    );

    useInitialScroll();

    const submit = useCallback(() => {
        const planned = {
            arbToBeDistributed: disbursementAmountLocal,
            contractsIncentivized: contractsLocal,
            distributionMechanism: distributionMechanismsLocal,
            expectations: expectationsLocal,
            changes: changesLocal,
        };

        if (!validators.isPlannedValid(planned)) {
            setShowErrors(true);
            return;
        }

        // set initial contracts on actuals, if we need to
        let actuals: GranteeActuals | null = null;
        if (isActualsEmpty(phase.actuals)) {
            actuals = {
                arbReceived: disbursementAmountLocal,
                arbUtilized: 0,
                arbRemaining: 0,
                contractsIncentivized: contractsLocal,
                incentives: '',
                disclosures: '',
                summary: '',
            };
        }

        dispatch(
            editPhase({
                phaseIndex,
                planned,
                actuals,

                // only write status if we're not finalized
                status:
                    phase.status === 'Finalized' ? 'Finalized' : 'InProgress',
            }),
        );
    }, [
        dispatch,
        phaseIndex,
        startDate,
        endDate,
        disbursementAmountLocal,
        contractsLocal,
        distributionMechanismsLocal,
        expectationsLocal,
        changesLocal,
        phase,
    ]);

    const isDisbursementValid = useMemo(
        () => validators.gteZero(disbursementAmountLocal),
        [disbursementAmountLocal],
    );
    const isDistributionMechanismsValid = useMemo(
        () => validators.isNotEmpty(distributionMechanismsLocal),
        [distributionMechanismsLocal],
    );
    const isExpectationsValid = useMemo(
        () => validators.isNotEmptyString(expectationsLocal),
        [expectationsLocal],
    );
    const isChangesValid = useMemo(
        () => validators.isNotEmptyString(changesLocal),
        [changesLocal],
    );
    const isFormValid =
        isDisbursementValid &&
        isDistributionMechanismsValid &&
        isExpectationsValid &&
        isChangesValid;
    const description = useMemo(() => {
        const now = new Date();
        if (now < startDate) {
            if (isValid) {
                return (
                    <div>
                        Once the two-week disbursement phase begins, you will be
                        able to update the project actuals.
                    </div>
                );
            }
            return (
                <div>
                    Before the two-week disbursement phase begins, please enter
                    the planned resources here. After the phase start date, you
                    will be able to update the project actuals.
                </div>
            );
        } else {
            return (
                <div>
                    The two-week disbursement phase has already begun. Please
                    enter planned resources to continue.
                </div>
            );
        }
    }, [isValid, startDate]);
    const wrapperClasses = useCallback(
        (isValid: boolean) =>
            classNames(
                showErrors && !isValid
                    ? 'ring-2 ring-red-300'
                    : 'ring-1 ring-gray-300',
                'rounded-md !rounded-b-none !rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
            ),
        [showErrors],
    );
    return (
        <div className="w-full">
            <div>
                {!hideDescription && (
                    <div className="text-lg px-4 py-4 ring-1 ring-inset ring-gray-300">
                        {description}
                    </div>
                )}
                <div className={wrapperClasses(isDisbursementValid)}>
                    <label className="text-xs font-medium text-gray-900 flex">
                        ARB Disbursement Amount (required)
                        <InfoTooltip text="Amount of ARB the disbursement address is planning to receive." />
                    </label>
                    <input
                        type="text"
                        className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter amount"
                        value={disbursementAmountLocal}
                        onChange={intHandler(setDisbursementAmountLocal)}
                    />
                </div>
                <div className={wrapperClasses(true)}>
                    <label className="text-xs font-medium text-gray-900 flex">
                        Contracts Incentivized
                        <InfoTooltip text="Contracts intended to be fundeded from disbursement address." />
                    </label>
                    <ContractSelector
                        allContracts={allContracts}
                        contractsSelected={contractsLocal}
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
                <div className={wrapperClasses(isDistributionMechanismsValid)}>
                    <label className="text-xs font-medium text-gray-900 flex">
                        Distribution Mechanisms (required)
                        <InfoTooltip text="Specific methods intended to be used to distribute ARB." />
                    </label>
                    <TagSelector
                        value={distributionMechanismsLocal}
                        schema={distributionMechanisms}
                        onAdd={value =>
                            setDistributionMechanismsLocal([
                                ...distributionMechanismsLocal,
                                value as DistributionMechanism,
                            ])
                        }
                        onRemove={value =>
                            setDistributionMechanismsLocal(
                                distributionMechanismsLocal.filter(
                                    v => v !== value,
                                ),
                            )
                        }
                    />
                </div>
                <div className={wrapperClasses(isChangesValid)}>
                    <label className="text-xs font-medium text-gray-900 mb-1 flex">
                        Changes (required)
                        <InfoTooltip text="Summary of changes intended to be made during this phase." />
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Meaningful changes that will be implemented compared to the original proposal or to the previous biweekly period"
                        value={changesLocal}
                        onChange={e => setChangesLocal(e.target.value)}
                    />
                </div>
                <div className={wrapperClasses(isExpectationsValid)}>
                    <label className="text-xs font-medium text-gray-900 mb-1 flex">
                        Expectations (required)
                        <InfoTooltip text="Expected result at the end of the phase." />
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Expectations for the next biweekly period"
                        value={expectationsLocal}
                        onChange={e => setExpectationsLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className={classNames(
                    isFormValid
                        ? 'hover:bg-purple-700'
                        : 'hover:animate-shake hover:bg-red-500',
                    'inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100',
                )}
                onClick={submit}
            >
                {isValid ? 'Update' : 'Submit'}
            </button>
        </div>
    );
};
export default PlannedResourcesForm;
