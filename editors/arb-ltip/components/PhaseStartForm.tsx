import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import TagSelector from './TagSelector';
import {
    Contract,
    DistributionMechanism,
} from '../../../document-models/arb-ltip-grantee';
import ContractSelector from './ContractSelector';
import { IProps } from '../editor';
import DatePicker from 'react-datepicker';
import { addPlanned } from '../../../document-models/arb-ltip-grantee/gen/creators';
import 'react-datepicker/dist/react-datepicker.css';

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

type PhaseStartFormProps = Pick<IProps, 'editorContext' | 'dispatch'>;
const PhaseStartForm = (props: PhaseStartFormProps) => {
    const { dispatch } = props;

    const [startDateLocal, setStartDateLocal] = useState(new Date());
    const [disbursementAmountLocal, setDisbursementAmountLocal] = useState(0);
    const [distributionMechanismsLocal, setDistributionMechanismsLocal] =
        useState([] as DistributionMechanism[]);
    const [contractsLocal, setContractsLocal] = useState([] as Contract[]);
    const [summaryLocal, setSummaryLocal] = useState('');
    const [summaryOfChangesLocal, setSummaryOfChangesLocal] = useState('');

    const endDate = useMemo(
        () => new Date(startDateLocal.getTime() + 12096e5),
        [startDateLocal],
    );

    const submit = useCallback(() => {
        const value = {
            arbToBeDistributed: disbursementAmountLocal,
            contractsIncentivized: contractsLocal,
            distributionMechanism: distributionMechanismsLocal,
            summary: summaryLocal,
            summaryOfChanges: summaryOfChangesLocal,
            endDate: endDate.toISOString(),
            startDate: startDateLocal.toISOString(),
        };

        dispatch(addPlanned(value));
    }, [
        dispatch,
        disbursementAmountLocal,
        contractsLocal,
        distributionMechanismsLocal,
        summaryLocal,
        summaryOfChangesLocal,
        endDate,
        startDateLocal,
    ]);

    return (
        <div className="w-full">
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600 flex">
                    <div>
                        <label className="block text-xs font-medium text-gray-900">
                            Start Date
                        </label>
                        <DatePicker
                            selected={startDateLocal}
                            onChange={date =>
                                setStartDateLocal(date || startDateLocal)
                            }
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-900">
                            End Date
                        </label>
                        <DatePicker
                            selected={endDate}
                            onChange={_ => {
                                /* disallow */
                            }}
                            disabled={true}
                        />
                    </div>
                </div>
                <div className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        ARB Disbursement Amount (required)
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter amount"
                        value={disbursementAmountLocal}
                        onChange={e => {
                            let val;
                            try {
                                val = parseInt(e.target.value);
                            } catch {
                                return;
                            }

                            if (isNaN(val)) {
                                return;
                            }

                            setDisbursementAmountLocal(val);
                        }}
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
                        value={summaryOfChangesLocal}
                        onChange={e => setSummaryOfChangesLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                onClick={submit}
            >
                Start
            </button>
        </div>
    );
};

export default PhaseStartForm;
