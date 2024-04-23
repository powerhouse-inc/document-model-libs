import { Phase } from '../../../document-models/arb-ltip-grantee';

const PhaseActuals = ({ phase: { actuals, stats } }: { phase: Phase }) => {
    const arbReceived = actuals?.arbReceived ? actuals.arbReceived : 0;
    const arbUtilized = actuals?.arbUtilized ? actuals.arbUtilized : 0;
    const arbRemaining = actuals?.arbRemaining ? actuals.arbRemaining : 0;

    const avgDailyTVL = stats?.avgDailyTVL ? stats.avgDailyTVL : 0;
    const avgDailyTXNS = stats?.avgDailyTXNS ? stats.avgDailyTXNS : 0;
    const avgDailyVolume = stats?.avgDailyVolume ? stats.avgDailyVolume : 0;
    const transactionFees = stats?.transactionFees ? stats.transactionFees : 0;
    const uniqueAddressesCount = stats?.uniqueAddressesCount
        ? stats.uniqueAddressesCount
        : 0;

    return (
        <div className="flex flex-col space-y-2 pb-4">
            <>
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
                            Average Daily Volume
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {avgDailyVolume}
                        </dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Transaction Fees
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {transactionFees}
                        </dd>
                    </div>
                    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                        <dt className="truncate text-sm font-medium text-gray-500">
                            Unique Addresses
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                            {uniqueAddressesCount}
                        </dd>
                    </div>
                </dl>
            </>
        </div>
    );
};

export default PhaseActuals;
