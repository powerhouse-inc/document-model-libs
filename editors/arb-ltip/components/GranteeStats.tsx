import { ArbLtipGranteeState } from '../../../document-models/arb-ltip-grantee';

const stats = [
    { name: 'Days Remaining', stat: '42 days' },
    { name: 'ARB Received', stat: '12000' },
    { name: 'ARB Remaining', stat: '48000' },
];

type GranteeStatsProps = ArbLtipGranteeState;
const GranteeStats = () => {
    return (
        <div>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map(item => (
                    <div
                        key={item.name}
                        className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
                    >
                        <dt className="truncate text-sm font-medium text-gray-500">
                            {item.name}
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {item.stat}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default GranteeStats;
