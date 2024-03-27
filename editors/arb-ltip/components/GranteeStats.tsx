import { useMemo } from 'react';
import { ArbLtipGranteeState } from '../../../document-models/arb-ltip-grantee';
import {
    calculateArbReceived,
    calculateDaysRemaining,
    calculateStatus,
    classNames,
    toArray,
} from '../util';

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
    const arbRemaining = useMemo(
        () => (state.grantSize || 0) - arbReceived,
        [state, arbReceived],
    );
    const status = useMemo(
        () => calculateStatus(toArray(state.phases)),
        [state],
    );

    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-4">
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
                        ARB Remaining
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                        {arbRemaining}
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
