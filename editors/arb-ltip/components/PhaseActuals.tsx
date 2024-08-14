import { useMemo } from 'react';
import {
    ArbitrumLtipGranteeState,
    Phase,
} from '../../../document-models/arbitrum-ltip-grantee';
import { calculateArbReceived, correctPhases } from '../util';

const PhaseActuals = ({
    phaseIndex,
    state,
}: {
    phaseIndex: number;
    state: ArbitrumLtipGranteeState;
}) => {
    const phases = useMemo(() => correctPhases(state.phases), [state.phases]);
    const phase = phases[phaseIndex];
    const { actuals, stats } = phase;

    const arbReceived = actuals?.arbReceived ? actuals.arbReceived : 0;
    const arbUtilized = actuals?.arbUtilized ? actuals.arbUtilized : 0;

    const avgDailyTVL = stats?.avgDailyTVL ? stats.avgDailyTVL : 0;
    const avgDailyTXNS = stats?.avgDailyTXNS ? stats.avgDailyTXNS : 0;
    const avgDailyUniqueUsers = stats?.avgDailyUniqueUsers
        ? stats.avgDailyUniqueUsers
        : 0;
    const changes = stats?.changes || '';
    const lessons = stats?.lessons || '';

    const arbRemaining = useMemo(() => {
        // calculate arb remaining before this phase
        const filteredPhases = phases.filter((_, i) => i < phaseIndex);

        // previous arb received
        const previousArbReceived = calculateArbReceived(filteredPhases);

        return (state.grantSize || 0) - previousArbReceived - arbReceived;
    }, [arbReceived, state.grantSize]);

    return (
        <div className="flex flex-col space-y-2 pb-4">
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                        ARB Utilized
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {arbUtilized}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                        ARB Remaining
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {arbRemaining}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                        Average Daily TVL
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {avgDailyTVL}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                        Average Daily Transactions
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {avgDailyTXNS}
                    </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">
                        Average Unique Users
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {avgDailyUniqueUsers}
                    </dd>
                </div>
            </dl>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                    Changes
                </dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-gray-900">
                    {changes}
                </dd>
            </div>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                <dt className="truncate text-sm font-medium text-gray-500">
                    Lessons Learned
                </dt>
                <dd className="mt-1 text-lg font-semibold tracking-tight text-gray-900">
                    {lessons}
                </dd>
            </div>
        </div>
    );
};

export default PhaseActuals;
