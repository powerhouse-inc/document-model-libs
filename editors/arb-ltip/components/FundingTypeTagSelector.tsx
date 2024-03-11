import { Menu, Transition } from '@headlessui/react';
import { FundingType } from '../../../document-models/arb-ltip-grantee';
import { Icon } from '@powerhousedao/design-system';
import { Fragment } from 'react/jsx-runtime';
import { classNames } from '../util';

type FundingTypeTag = {
    name: string;
    value: FundingType;
};
const fundingTypes: FundingTypeTag[] = [
    {
        name: 'EOA',
        value: 'EOA',
    },
    {
        name: 'Multisig',
        value: 'Multisig',
    },
    {
        name: '3/5 Multisig',
        value: 'ThreeofFiveMultisig',
    },
    {
        name: '2/3 Multisig',
        value: 'TwoofThreeMultisig',
    },
];

type FundingTypeTagSelectorProps = {
    value: FundingType[];
    onAdd: (value: FundingType) => void;
    onRemove: (value: FundingType) => void;
};

const FundingTypeTagSelector = ({
    value,
    onAdd,
    onRemove,
}: FundingTypeTagSelectorProps) => {
    return (
        <div>
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 text-sm text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Add
                        <Icon
                            className="pt-2"
                            name="caret-down"
                            size={16}
                            color="#7C878E"
                        />
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="">
                            {fundingTypes
                                .filter(
                                    type => !value.some(v => v === type.value),
                                )
                                .map(type => (
                                    <Menu.Item key={type.name}>
                                        {({ active }) => (
                                            <p
                                                className={classNames(
                                                    active
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : 'text-gray-700',
                                                    'cursor-pointer block px-4 py-2 text-sm',
                                                )}
                                                onClick={() => {
                                                    if (
                                                        value.includes(
                                                            type.value,
                                                        )
                                                    ) {
                                                        onRemove(type.value);
                                                    } else {
                                                        onAdd(type.value);
                                                    }
                                                }}
                                            >
                                                {type.name}
                                            </p>
                                        )}
                                    </Menu.Item>
                                ))}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>

            {value.map(type => (
                <span
                    key={type}
                    className="inline-flex items-center mx-2 px-2.5 py-0.5 rounded-md text-xs font-medium bg-purple-100 text-purple-800"
                >
                    {type}
                    <button
                        type="button"
                        className="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-purple-400 hover:bg-purple-200 hover:text-purple-500 focus:outline-none focus:bg-purple-500"
                        onClick={() => onRemove(type)}
                    >
                        <Icon name="trash" size={16} />
                    </button>
                </span>
            ))}
        </div>
    );
};

export default FundingTypeTagSelector;
