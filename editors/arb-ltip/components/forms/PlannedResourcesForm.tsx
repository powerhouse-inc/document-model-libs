import { useCallback, useMemo, useState } from 'react';
import TagSelector from '../TagSelector';
import {
    ArbitrumLtipGranteeState,
    DistributionMechanism,
    GranteeActuals,
    Phase,
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
};
const PlannedResourcesForm = (props: PlannedResourcesFormProps) => {
    const { dispatch, phase, phaseIndex, state } = props;
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

        // set initial contracts on actuals as well
        const actuals: GranteeActuals = {
            arbReceived: disbursementAmountLocal,
            arbUtilized: 0,
            arbRemaining: 0,
            contractsIncentivized: contractsLocal,
            incentives: '',
            disclosures: '',
            summary: '',
        };

        dispatch(
            editPhase({
                phaseIndex,
                planned,
                actuals,
                status: 'InProgress',
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
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <PhaseTimespan phase={phase} />
                <div className="text-lg px-4 py-4 ring-1 ring-inset ring-gray-300">
                    {description}
                </div>
                <div className={wrapperClasses(isDisbursementValid)}>
                    <label className="text-xs font-medium text-gray-900">
                        ARB Disbursement Amount (required)
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
                    <label className="text-xs font-medium text-gray-900">
                        Contracts Incentivized
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
                    <label className="text-xs font-medium text-gray-900">
                        Distribution Mechanisms (required)
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
                    <label className="text-xs font-medium text-gray-900 mb-1">
                        Changes (required)
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
                    <label className="text-xs font-medium text-gray-900 mb-1">
                        Expectations (required)
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
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={submit}
            >
                {isValid ? 'Update' : 'Submit'}
            </button>
        </div>
    );
};

export default PlannedResourcesForm;
