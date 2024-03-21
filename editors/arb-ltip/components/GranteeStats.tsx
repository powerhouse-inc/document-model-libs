import { useMemo } from 'react';
import {
    ArbLtipGranteeState,
    Phase,
} from '../../../document-models/arb-ltip-grantee';
import { classNames, toArray } from '../util';
import validators from '../../../document-models/arb-ltip-grantee/src/validators';

const calculateDaysRemaining = (phases: Phase[]) => {
    const firstPhase = phases[0];
    const lastPhase = phases[phases.length - 1];

    let start = new Date();
    if (start < new Date(firstPhase.startDate)) {
        start = new Date(firstPhase.startDate);
    }

    const end = new Date(lastPhase.endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const calculateArbReceived = (phases: Phase[]) => {
    let total = 0;
    for (const phase of phases) {
        total += phase.actuals?.arbReceived || 0;
    }

    return total;
};

const calculateStatus = (phases: Phase[]) => {
    const now = new Date();
    for (const phase of phases) {
        const isPhaseStarted = new Date(phase.startDate) < now;
        const isPhaseComplete = new Date(phase.endDate) < now;
        const isPhaseInProgress = isPhaseStarted && !isPhaseComplete;

        if (!isPhaseStarted) {
            break;
        }

        const isPlannedValid =
            !!phase.planned && validators.isPlannedValid(phase.planned);
        const isActualsValid =
            !!phase.actuals && validators.isActualsValid(phase.actuals);
        const isStatsValid =
            !!phase.stats && validators.isStatsValid(phase.stats);

        if (isPhaseInProgress) {
            if (!isPlannedValid) {
                return 'Overdue';
            }
        }

        if (isPhaseComplete) {
            if (!isPlannedValid || !isActualsValid || !isStatsValid) {
                return 'Overdue';
            }
        }
    }

    return 'On Track';
};

type GranteeStatsProps = {
    state: ArbLtipGranteeState;
    onOpenHistorical: () => void;
};
const GranteeStats = ({ state, onOpenHistorical }: GranteeStatsProps) => {
    const daysRemaining = useMemo(
        () => calculateDaysRemaining(toArray(state.phases)),
        [state],
    );
    const arbReceived = useMemo(
        () => calculateArbReceived(toArray(state.phases)),
        [state],
    );
    const status = useMemo(
        () => calculateStatus(toArray(state.phases)),
        [state],
    );

    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                        Days Remaining
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {daysRemaining}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                        ARB Received
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {arbReceived}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                        Status
                    </dt>
                    <dd
                        className={classNames(
                            status === 'Overdue'
                                ? 'text-red-600'
                                : 'text-green-600',
                            'mt-1 text-3xl font-semibold tracking-tight cursor-pointer underline',
                        )}
                        onClick={onOpenHistorical}
                    >
                        {status}
                    </dd>
                </div>
            </dl>
        </div>
    );
};

export default GranteeStats;
