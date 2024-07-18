import { useMemo } from 'react';
import { ArbitrumLtipGranteeState } from '../../../document-models/arbitrum-ltip-grantee';
import {
    calculateArbReceived,
    calculateDaysRemaining,
    calculateStatus,
    classNames,
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

    const totalArb = state.grantSize || 0;

    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500 flex">
                        Days Remaining
                        <InfoTooltip text="The number of days remaining in the grant period." />
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {daysRemaining}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500 flex">
                        % ARB Utilized
                        <InfoTooltip text="The total amount of reported ARB received / grant size." />
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {formatPercent(arbReceived / totalArb)}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500 flex">
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
