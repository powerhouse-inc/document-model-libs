import { useState } from 'react';
import TagSelector from './TagSelector';
import {
    Contract,
    DistributionMechanism,
} from '../../../document-models/arb-ltip-grantee';
import ContractSelector from './ContractSelector';

const distributionMechanisms = [
    {
        name: 'Airdrop',
        value: 'Airdrop',
    },
    {
        name: 'LP Incentives',
        value: 'LPIncentives',
    },
];

const PhaseStartForm = () => {
    const [disbursementAmountLocal, setDisbursementAmountLocal] = useState(0);
    const [distributionMechanismsLocal, setDistributionMechanismsLocal] =
        useState([] as DistributionMechanism[]);
    const [contractsLocal, setContractsLocal] = useState([] as Contract[]);
    const [summaryLocal, setSummaryLocal] = useState('');
    const [summaryOfChangesLocal, setSummaryOfChangesLocal] = useState('');

    return (
        <div className="w-full">
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <div className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        ARB Disbursement Amount (required)
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter amount"
                        value={disbursementAmountLocal}
                        onChange={e =>
                            setDisbursementAmountLocal(parseInt(e.target.value))
                        }
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Contracts Incentivized
                    </label>
                    <ContractSelector
                        contracts={contractsLocal}
                        onAdd={contract =>
                            setContractsLocal([...contractsLocal, contract])
                        }
                        onRemove={id =>
                            setContractsLocal(
                                contractsLocal.filter(c => c.contractId !== id),
                            )
                        }
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Distribution Mechanisms
                    </label>
                    <TagSelector
                        value={distributionMechanismsLocal}
                        schema={distributionMechanisms}
                        onAdd={value =>
                            setDistributionMechanismsLocal([
                                ...distributionMechanismsLocal,
                                value as DistributionMechanism,
                            ])
                        }
                        onRemove={value =>
                            setDistributionMechanismsLocal(
                                distributionMechanismsLocal.filter(
                                    v => v !== value,
                                ),
                            )
                        }
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Summary
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter summary here"
                        defaultValue={''}
                        value={summaryLocal}
                        onChange={e => setSummaryLocal(e.target.value)}
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Summary of Changes
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter summary of changes here"
                        defaultValue={''}
                        value={summaryOfChangesLocal}
                        onChange={e => setSummaryOfChangesLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
                Start
            </button>
        </div>
    );
};

export default PhaseStartForm;
