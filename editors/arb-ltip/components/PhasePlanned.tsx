import {
    DistributionMechanism,
    Phase,
} from '../../../document-models/arb-ltip-grantee';

const PhasePlanned = ({ phase: { planned } }: { phase: Phase }) => {
    const arbToBeDistributed = planned?.arbToBeDistributed
        ? planned.arbToBeDistributed
        : 0;

    const summary = planned?.summary ? planned.summary : 'None';

    const summaryOfChanges = planned?.summaryOfChanges
        ? planned.summaryOfChanges
        : 'None';

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

    return (
        <div className="rounded-md !rounded-t-none !rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 flex flex-col space-y-2">
            <div>
                <span className="text-xl">Planned Resources</span>
            </div>
            <>
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
                        Summary
                    </label>
                    <p>{summary}</p>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-900">
                        Summary Of Changes
                    </label>
                    <p>{summaryOfChanges}</p>
                </div>
            </>
        </div>
    );
};

export default PhasePlanned;
