import { Phase } from '../../../document-models/arb-ltip-grantee';

const PhaseStats = ({ phase: { stats } }: { phase: Phase }) => {
    const avgDailyTVL = stats?.avgDailyTVL ? stats.avgDailyTVL : 0;
    const avgDailyTXNS = stats?.avgDailyTXNS ? stats.avgDailyTXNS : 0;
    const avgDailyVolume = stats?.avgDailyVolume ? stats.avgDailyVolume : 0;
    const transactionFees = stats?.transactionFees ? stats.transactionFees : 0;
    const uniqueAddressesCount = stats?.uniqueAddressesCount
        ? stats.uniqueAddressesCount
        : 0;

    // all phases are initialized with values set to 0
    const submissionStatus = stats?.avgDailyTVL ? true : false;

    return (
        <div className="relative rounded-md !rounded-t-none !rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600 flex">
            <div className="flex-1" />
            <div>
                <div>
                    Stats
                    {!submissionStatus && <p>Not Started</p>}
                </div>
                <div>
                    {submissionStatus && (
                        <div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    Average Daily TVL
                                </label>
                                <p>{avgDailyTVL} </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    Average Daily Transactions
                                </label>
                                <p>{avgDailyTXNS} </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    Average Daily Volume
                                </label>
                                <p>{avgDailyVolume} </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    Transaction Fees
                                </label>
                                <p>{transactionFees} </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    Unique Addresses Count
                                </label>
                                <p>{uniqueAddressesCount} </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1" />
        </div>
    );
};

export default PhaseStats;
