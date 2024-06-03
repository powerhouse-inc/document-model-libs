import {
    DistributionMechanism,
    Phase,
} from '../../../document-models/arb-ltip-grantee';

function translateDistributionMechanism(
    distributionMechanism: DistributionMechanism,
): string {
    switch (distributionMechanism) {
        case 'Airdrop':
            return 'Airdrop';
        case 'LPIncentives':
            return 'LP Incentives';
        default:
            return 'Unknown Mechanism';
    }
}

const PhasePlanned = ({ phase: { planned, actuals } }: { phase: Phase }) => {
    const arbToBeDistributed = planned?.arbToBeDistributed
        ? planned.arbToBeDistributed
        : 0;

    const changes = planned?.changes || 'None';
    const expectations = planned?.expectations || 'None';

    const distributionMechanismText =
        planned?.distributionMechanism?.map(distribution =>
            distribution
                ? translateDistributionMechanism(distribution)
                : 'Unknown Mechanism',
        ) ?? [];

    const contractsDetails =
        planned?.contractsIncentivized?.map(contract => ({
            label: contract?.contractLabel,
            link: `https://arbiscan.io/address/${contract?.contractAddress}`,
        })) ?? [];

    const actualsDisclosures = actuals?.disclosures
        ? actuals.disclosures
        : 'None';
    const actualsSummary = actuals?.summary ? actuals.summary : 'None';
    const actualsContractsDetails =
        actuals?.contractsIncentivized?.map(contract => ({
            label: contract?.contractLabel,
            link: `https://arbiscan.io/address/${contract?.contractAddress}`,
        })) ?? [];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 pt-4">
            <div className="flex flex-col justify-start space-y-2 px-4">
                <div>
                    <span className="text-2xl font-bold">Planned</span>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-900">
                        ARB To Be Distributed
                    </label>
                    <p>{arbToBeDistributed} </p>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-900">
                        Contracts Incentivized
                    </label>
                    <div>
                        {contractsDetails.length === 0 && <p>None</p>}
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
                    <label className="text-xs font-medium text-gray-900">
                        Distribution Mechanisms
                    </label>
                    <div>
                        {distributionMechanismText.length === 0 && <p>None</p>}
                        {distributionMechanismText.map(
                            (distribution, index) => (
                                <div key={index}>
                                    <p>{distribution}</p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-900">
                        Changes
                    </label>
                    <p>{changes}</p>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-900">
                        Expectations
                    </label>
                    <p>{expectations}</p>
                </div>
            </div>
            <div className="flex flex-col justify-start space-y-2 px-4">
                <div>
                    <span className="text-2xl font-bold">Actuals</span>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-900">
                        Contracts Incentivized
                    </label>
                    <div>
                        {actualsContractsDetails.length === 0 && <p>None</p>}
                        {actualsContractsDetails.map((contract, index) => (
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
                    <label className="text-xs font-medium text-gray-900">
                        Disclosures
                    </label>
                    <p>{actualsDisclosures}</p>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-900">
                        Summary
                    </label>
                    <p>{actualsSummary}</p>
                </div>
            </div>
        </div>
    );
};

export default PhasePlanned;
