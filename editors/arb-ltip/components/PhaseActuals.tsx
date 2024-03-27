import { Phase } from '../../../document-models/arb-ltip-grantee';

const PhaseActuals = ({ phase: { actuals } }: { phase: Phase }) => {
    const arbReceived = actuals?.arbReceived ? actuals.arbReceived : 0;
    const arbUtilized = actuals?.arbUtilized ? actuals.arbUtilized : 0;
    const arbRemaining = actuals?.arbRemaining ? actuals.arbRemaining : 0;

    const disclosures = actuals?.disclosures ? actuals.disclosures : 'none';

    const summary = actuals?.summary ? actuals.summary : 'none';

    // all phases are initialized with values set to 0
    const submissionStatus = actuals?.arbReceived ? true : false;

    const contractsDetails =
        actuals?.contractsIncentivized?.map(contract => ({
            label: contract?.contractLabel,
            link: `https://arbiscan.io/address/${contract?.contractAddress}`,
        })) ?? [];

    return (
        <div className="relative rounded-md !rounded-t-none !rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600 flex">
            <div className="flex-1" />
            <div>
                <div>
                    Actuals
                    {!submissionStatus && <p>Not Started</p>}
                </div>
                <div>
                    {submissionStatus && (
                        <div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    ARB Received
                                </label>
                                <p>{arbReceived} </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    ARB Utilized
                                </label>
                                <p>{arbUtilized} </p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    ARB Remaining
                                </label>
                                <p>{arbRemaining} </p>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    Contracts Incentivized
                                </label>
                                <div>
                                    {contractsDetails.map((contract, index) => (
                                        <div key={index}>
                                            <a
                                                href={contract.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {contract.label}
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    Disclosures
                                </label>
                                <p>{disclosures}</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-900">
                                    Summary
                                </label>
                                <p>{summary}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1" />
        </div>
    );
};

export default PhaseActuals;
