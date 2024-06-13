import { ArbitrumLtipGranteeState } from '../../../../document-models/arbitrum-ltip-grantee';
import GranteeStats from '../GranteeStats';
import { useIsEditor } from '../UserProvider';

type TabSummaryProps = ArbitrumLtipGranteeState & {
    onEdit: () => void;
    onOpenHistorical: () => void;
};
const TabSummary = (props: TabSummaryProps) => {
    const {
        granteeName,
        grantSummary,
        disbursementContractAddress,
        fundingAddress,
        metricsDashboardLink,
    } = props;

    const isEditor = useIsEditor();

    return (
        <div>
            <div className="px-4 sm:px-0 flex items-center">
                <p className="flex-1 mt-3 font-semibold text-4xl text-gray-900 truncate">
                    {granteeName}
                </p>
                {isEditor && (
                    <button
                        type="button"
                        className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        onClick={props.onEdit}
                    >
                        Edit
                    </button>
                )}
            </div>
            {metricsDashboardLink && (
                <div className="px-4 sm:px-0 flex items-center">
                    <a
                        href={metricsDashboardLink}
                        target="_blank"
                        className="underline mt-1 max-w-2xl text-sm leading-6 text-gray-500"
                        rel="noreferrer"
                    >
                        Metrics Dashboard
                    </a>
                </div>
            )}
            <GranteeStats
                state={props}
                onOpenHistorical={props.onOpenHistorical}
            />
            <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                            Disbursement Address
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 truncate underline">
                            <a
                                href={`https://arbiscan.io/address/${disbursementContractAddress}`}
                                target="blank"
                            >
                                {disbursementContractAddress}
                            </a>
                        </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                            Funding Address
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 truncate underline">
                            <a
                                href={`https://arbiscan.io/address/${fundingAddress}`}
                                target="blank"
                            >
                                {fundingAddress}
                            </a>
                        </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                            Summary
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                            {grantSummary}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default TabSummary;
