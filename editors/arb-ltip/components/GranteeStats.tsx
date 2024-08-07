import { useMemo } from 'react';
import { ArbitrumLtipGranteeState } from '../../../document-models/arbitrum-ltip-grantee';
import {
    calculateArbReceived,
    calculateArbUtilized,
    calculateDaysRemaining,
    calculateStatus,
    classNames,
    correctPhases,
    formatPercent,
    toArray,
} from '../util';
import InfoTooltip from './InfoTooltip';

type GranteeStatsProps = {
    state: ArbitrumLtipGranteeState;
    onOpenHistorical: () => void;
};
const GranteeStats = ({ state, onOpenHistorical }: GranteeStatsProps) => {
    const daysRemaining = useMemo(
        () => calculateDaysRemaining(correctPhases(state.phases)),
        [state],
    );
    const arbUtilized = useMemo(
        () => calculateArbUtilized(correctPhases(state.phases)),
        [state],
    );
    const status = useMemo(
        () => calculateStatus(correctPhases(state.phases)),
        [state],
    );
    const totalArb = state.grantSize || 0;
    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500 flex items-baseline">
                        Days Remaining
                        <InfoTooltip text="The number of days remaining in the grant period." />
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {daysRemaining}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500 flex items-baseline">
                        Grant Size (ARB)
                        <InfoTooltip text="The total grant size, in ARB." />
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {totalArb}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500 flex items-baseline">
                        % ARB Utilized
                        <InfoTooltip text="The total amount of reported ARB utilized / grant size." />
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {formatPercent(arbUtilized / totalArb)}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500 flex items-baseline">
                        Status
                        <InfoTooltip text="Report status." />
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
