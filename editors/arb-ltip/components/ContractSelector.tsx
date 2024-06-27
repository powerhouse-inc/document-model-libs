import { Contract } from '../../../document-models/arbitrum-ltip-grantee';
import { useCallback, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import validators from '../../../document-models/arbitrum-ltip-grantee/src/validators';
import { classNames } from '../util';
import { Icon } from '@powerhousedao/design-system';

type ContractSelectorProps = {
    allContracts: Contract[];
    contractsSelected: Contract[];
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
                <p className="block w-full p-0 text-gray-900 text-lg font-bold">
                    {contractLabel}
                </p>
            </div>
            <div className="relative px-3 pb-1.5 pt-2.5">
                <p className="block w-full p-0 text-gray-900 text-sm truncate underline">
                    <a
                        href={`https://arbiscan.io/address/${contractAddress}`}
                        target="blank"
                    >
                        {contractAddress}
                    </a>
                </p>
            </div>
            <div className="flex-1"></div>
            <span>
                <Icon
                    className="text-red-600 hover:text-red-800 cursor-pointer mt-2"
                    name="trash"
                    size={24}
                    onClick={onRemove}
                />
            </span>
        </div>
    );
};

const NEW_VALUE = 'new';

type ContractListProps = {
    contracts: Contract[];
    selected: string;
    setSelected: (selected: string) => void;
};
const ContractList = ({
    contracts,
    selected,
    setSelected,
}: ContractListProps) => {
    return (
        <div>
            <select
                id="contracts"
                name="contracts"
                className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={selected}
                onChange={e => setSelected(e.target.value)}
            >
                <option value={NEW_VALUE}>Add new...</option>

                {contracts.map(contract => (
                    <option
                        key={contract.contractId}
                        value={contract.contractId}
                    >
                        {contract.contractLabel}
                    </option>
                ))}
            </select>
        </div>
    );
};

const ContractSelector = (props: ContractSelectorProps) => {
    const { contractsSelected, allContracts, onAdd, onRemove } = props;

    const [showErrors, setShowErrors] = useState(false);
    const [labelLocal, setLabelLocal] = useState('');
    const [addressLocal, setAddressLocal] = useState('');
    const [selected, setSelected] = useState('Funding Address');

    const isLabelValid = useMemo(
        () => validators.isNotEmptyString(labelLocal),
        [labelLocal],
    );

    const isAddressValid = useMemo(
        () =>
            validators.isValidAddress(addressLocal) &&
            !contractsSelected.find(c => c.contractAddress === addressLocal),
        [addressLocal],
    );

    const submit = useCallback(() => {
        let contract: Contract;

        if (NEW_VALUE === selected) {
            if (!isLabelValid || !isAddressValid) {
                setShowErrors(true);
                return;
            }

            contract = {
                contractId: v4(),
                contractAddress: addressLocal,
                contractLabel: labelLocal,
            };
        } else {
            const selectedContract = allContracts.find(
                c => c.contractId === selected,
            );
            if (!selectedContract) {
                return;
            }

            contract = selectedContract;
        }

        // check if this contract is already added
        if (
            contractsSelected.find(
                c => c.contractAddress === contract.contractAddress,
            )
        ) {
            return;
        }

        onAdd(contract);

        setShowErrors(false);
        setLabelLocal('');
        setAddressLocal('');
    }, [
        isLabelValid,
        isAddressValid,
        labelLocal,
        addressLocal,
        selected,
        onAdd,
    ]);

    const wrapperClasses = useCallback(
        (isValid: boolean, classes = '') =>
            classNames(
                showErrors && !isValid
                    ? 'ring-2 ring-red-300'
                    : 'ring-1 ring-gray-300',
                classes,
                'relative rounded-md !rounded-b-none !rounded-t-none px-3 pb-1.5 pt-2.5 ring-inset focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600',
            ),
        [showErrors],
    );

    return (
        <div>
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="h-60 rounded-lg bg-white px-4 pt-2 pb-5 shadow-lg flex flex-col -space-y-px">
                    <div className="pb-4">
                        <ContractList
                            contracts={allContracts}
                            selected={selected}
                            setSelected={setSelected}
                        />
                    </div>

                    {selected === 'new' && (
                        <div className="pb-4">
                            <div className={wrapperClasses(isLabelValid)}>
                                <label className="block text-xs font-medium text-gray-900">
                                    Contract Label
                                </label>
                                <input
                                    type="text"
                                    className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    placeholder="Enter label"
                                    value={labelLocal}
                                    onChange={e =>
                                        setLabelLocal(e.target.value)
                                    }
                                />
                            </div>
                            <div className={wrapperClasses(isAddressValid)}>
                                <label className="block text-xs font-medium text-gray-900">
                                    Contract Address
                                </label>
                                <input
                                    type="text"
                                    className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                    placeholder="0x..."
                                    value={addressLocal}
                                    onChange={e =>
                                        setAddressLocal(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex-1"></div>
                        </div>
                    )}
                    <div className="flex justify-between w-100">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            onClick={submit}
                        >
                            Add
                        </button>
                    </div>
                </div>
                {contractsSelected.map(contract => (
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
