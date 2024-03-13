import { Icon } from '@powerhousedao/design-system';
import { Contract } from '../../../document-models/arb-ltip-grantee';
import { useMemo, useState } from 'react';
import { v4 } from 'uuid';

type ContractSelectorProps = {
    contracts: Contract[];
    onAdd: (contract: Contract) => void;
    onRemove: (id: string) => void;
};

type ContractCardProps = {
    contract: Contract;
    onRemove: () => void;
};
const ContractCard = (props: ContractCardProps) => {
    const {
        contract: { contractLabel, contractAddress },
        onRemove,
    } = props;

    return (
        <div className="h-60 rounded-lg bg-white px-4 py-5 shadow-lg sm:p-6 flex flex-col -space-y-px">
            <div className="relative px-3 pb-1.5 pt-2.5">
                <label className="block text-xs font-medium text-gray-900">
                    Contract Label
                </label>
                <p className="block w-full p-0 text-gray-900 placeholder:text-gray-400sm:text-sm sm:leading-6">
                    {contractLabel}
                </p>
            </div>
            <div className="relative px-3 pb-1.5 pt-2.5">
                <label className="block text-xs font-medium text-gray-900">
                    Contract Address
                </label>
                <p className="block w-full p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 truncate">
                    {contractAddress}
                </p>
            </div>
            <div className="flex-1"></div>
            <span
                className="text-red-600 hover:text-red-800 cursor-pointer"
                onClick={onRemove}
            >
                <Icon className="mt-2" name="trash" size={24} />
            </span>
        </div>
    );
};

const ContractSelector = (props: ContractSelectorProps) => {
    const { contracts, onAdd, onRemove } = props;

    const [labelLocal, setLabelLocal] = useState('');
    const [addressLocal, setAddressLocal] = useState('');

    const submit = () => {
        const contract: Contract = {
            contractId: v4(),
            contractAddress: addressLocal,
            contractLabel: labelLocal,
        };

        onAdd(contract);

        setLabelLocal('');
        setAddressLocal('');
    };

    const isValid = useMemo(() => {
        if (!labelLocal) {
            return false;
        }

        if (!addressLocal) {
            return false;
        }

        return true;
    }, [labelLocal, addressLocal]);

    return (
        <div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="h-60 rounded-lg bg-white px-4 py-5 shadow-lg sm:p-6 flex flex-col -space-y-px">
                    <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                        <label className="block text-xs font-medium text-gray-900">
                            Contract Label
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Enter label"
                            value={labelLocal}
                            onChange={e => setLabelLocal(e.target.value)}
                        />
                    </div>
                    <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                        <label className="block text-xs font-medium text-gray-900">
                            Contract Address
                        </label>
                        <input
                            type="text"
                            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="0x..."
                            value={addressLocal}
                            onChange={e => setAddressLocal(e.target.value)}
                        />
                    </div>
                    <div className="flex-1"></div>
                    <div className="flex justify-between w-100">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            onClick={submit}
                            disabled={!isValid}
                        >
                            Add
                        </button>
                    </div>
                </div>
                {contracts.map(contract => (
                    <ContractCard
                        key={contract.contractId}
                        contract={contract}
                        onRemove={() => onRemove(contract.contractId)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContractSelector;
