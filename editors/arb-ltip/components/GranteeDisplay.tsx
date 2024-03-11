import { ArbLtipGranteeState } from '../../../document-models/arb-ltip-grantee';

type GranteeDisplayProps = ArbLtipGranteeState & { onEdit: () => void };
const GranteeDisplay = (props: GranteeDisplayProps) => {
    const {
        granteeName,
        grantSummary,
        disbursementContractAddress,
        fundingAddress,
        metricsDashboardLink,
    } = props;
    return (
        <div>
            <div className="px-4 sm:px-0 flex items-center">
                <p className="flex-1 mt-3 font-semibold text-4xl text-gray-900">
                    {granteeName}
                </p>
                <button
                    type="button"
                    className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    onClick={props.onEdit}
                >
                    Edit
                </button>
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
            <div className="mt-6">
                <dl className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                            Disbursement Address
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 truncate">
                            {disbursementContractAddress}
                        </dd>
                    </div>
                    <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                            Funding Address
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2 truncate">
                            {fundingAddress}
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
                    <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900">
                            Reports
                        </dt>
                        <dd className="mt-2 text-sm text-gray-900">
                            <ul
                                role="list"
                                className="divide-y divide-gray-100 rounded-md border border-gray-200"
                            >
                                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                    <div className="flex w-0 flex-1 items-center">
                                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                            <span className="truncate font-medium">
                                                11/23/14
                                            </span>
                                            <span className="flex-shrink-0 text-gray-400">
                                                2.4mb
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <a
                                            href="#"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                                    <div className="flex w-0 flex-1 items-center">
                                        <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                            <span className="truncate font-medium">
                                                coverletter_back_end_developer.pdf
                                            </span>
                                            <span className="flex-shrink-0 text-gray-400">
                                                4.5mb
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <a
                                            href="#"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            Download
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
};

export default GranteeDisplay;
