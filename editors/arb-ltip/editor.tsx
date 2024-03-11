import { EditorProps } from 'document-model/document';
import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
    FundingType,
} from '../../document-models/arb-ltip-grantee';
import { Icon, RWATabsProps } from '@powerhousedao/design-system';
import { TextInput } from 'document-model-editors';
import {
    setGranteeName,
    setGranteeSummary,
} from '../../document-models/arb-ltip-grantee/gen/creators';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import './style.css';
import { Maybe } from 'document-model/document-model';

export type CustomEditorProps = Pick<
    RWATabsProps,
    'onClose' | 'onExport' | 'onSwitchboardLinkClick'
>;

type IProps = EditorProps<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState
>;

type GranteeSaveProps = Pick<
    ArbLtipGranteeState,
    | 'disbursementContractAddress'
    | 'fundingAddress'
    | 'fundingType'
    | 'grantSummary'
    | 'granteeName'
>;
type GranteeFormProps = ArbLtipGranteeState &
    Pick<IProps, 'editorContext' | 'dispatch'>;

function maybeToArray<T>(value: Maybe<Maybe<T>[]>): T[] {
    if (!value) {
        return [];
    }

    return value.filter(v => v !== null) as T[];
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

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

const GranteeForm = (props: GranteeFormProps) => {
    const {
        editorContext,
        dispatch,
        granteeName,
        metricsDashboardLink,
        grantSummary,
        disbursementContractAddress,
        fundingAddress,
        fundingType,
    } = props;

    const [granteeNameLocal, setGranteeNameLocal] = useState(granteeName || '');
    const [
        disbursementContractAddressLocal,
        setDisbursementContractAddressLocal,
    ] = useState(disbursementContractAddress || '');
    const [fundingAddressLocal, setFundingAddressLocal] = useState(
        fundingAddress || '',
    );
    const [fundingTypeLocal, setFundingTypeLocal] = useState(
        maybeToArray(fundingType),
    );
    const [grantSummaryLocal, setGrantSummaryLocal] = useState(
        grantSummary || '',
    );

    const onSetGranteeName = useCallback(
        (name: string) => {
            setGranteeNameLocal(name);
            dispatch(setGranteeName({ granteeName: name }));
        },
        [dispatch, granteeNameLocal],
    );

    const onSubmit = useCallback(() => {
        dispatch(
            setGranteeSummary({
                disbursementContractAddress: disbursementContractAddressLocal,
                fundingAddress: fundingAddressLocal,
                fundingType: [],
                grantSummary: grantSummaryLocal,
            }),
        );
    }, [
        dispatch,
        disbursementContractAddressLocal,
        fundingAddressLocal,
        grantSummaryLocal,
    ]);

    const isValid = useMemo(() => {
        if (!disbursementContractAddressLocal) {
            return false;
        }

        if (!fundingAddressLocal) {
            return false;
        }

        if (!fundingTypeLocal) {
            return false;
        }

        if (!grantSummaryLocal) {
            return false;
        }

        if (!granteeNameLocal) {
            return false;
        }

        return true;
    }, [
        disbursementContractAddressLocal,
        fundingAddressLocal,
        fundingTypeLocal,
        grantSummaryLocal,
        granteeNameLocal,
    ]);

    return (
        <div className="w-full">
            <div>
                <TextInput
                    key="grantee-name"
                    value={granteeNameLocal}
                    size="huge"
                    placeholder="Grantee Name"
                    theme={editorContext.theme}
                    onSubmit={onSetGranteeName}
                    autoFocus
                />
            </div>
            <div className="isolate -space-y-px rounded-md shadow-sm">
                <div className="relative rounded-md rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Disbursement Address
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="0x..."
                        value={disbursementContractAddressLocal}
                        onChange={e =>
                            setDisbursementContractAddressLocal(e.target.value)
                        }
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Funding Address
                    </label>
                    <input
                        type="text"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="0x..."
                        value={fundingAddressLocal}
                        onChange={e => setFundingAddressLocal(e.target.value)}
                    />
                </div>
                <div className="relative rounded-md rounded-t-none rounded-b-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900 mb-1">
                        Funding Type(s)
                    </label>
                    <FundingTypeTagSelector
                        value={fundingTypeLocal}
                        onAdd={value => {
                            setFundingTypeLocal([...fundingTypeLocal, value]);
                        }}
                        onRemove={value => {
                            setFundingTypeLocal(
                                fundingTypeLocal.filter(v => v !== value),
                            );
                        }}
                    />
                </div>
                <div className="relative rounded-md rounded-t-none px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-purple-600">
                    <label className="block text-xs font-medium text-gray-900">
                        Grant Summary
                    </label>
                    <textarea
                        rows={4}
                        name="comment"
                        id="comment"
                        className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Enter grant summary here"
                        defaultValue={''}
                        value={grantSummaryLocal}
                        onChange={e => setGrantSummaryLocal(e.target.value)}
                    />
                </div>
            </div>
            <button
                type="button"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 disabled:bg-slate-100 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                disabled={!isValid}
                onClick={onSubmit}
            >
                Save
            </button>
        </div>
    );
};

type GranteeDisplayProps = ArbLtipGranteeState & { onEdit: () => void };
const GranteeDisplay = (props: GranteeDisplayProps) => {
    return (
        <div>
            <div key="header-left" className="editor-worksheet--header-left">
                <div>{props.granteeName}</div>
                <div>{props.grantSummary}</div>
                <div>{props.metricsDashboardLink}</div>
            </div>
        </div>
    );
};

const Editor = (props: IProps) => {
    const { document } = props;
    const [isEditMode, setIsEditMode] = useState(false);

    const {
        disbursementContractAddress,
        fundingAddress,
        fundingType,
        grantSummary,
        granteeName,
        metricsDashboardLink,
    } = document.state.global;
    const isValid = useMemo(() => {
        if (!disbursementContractAddress) {
            return false;
        }

        if (!fundingAddress) {
            return false;
        }

        if (!fundingType) {
            return false;
        }

        if (!grantSummary) {
            return false;
        }

        if (!granteeName) {
            return false;
        }

        return true;
    }, [
        disbursementContractAddress,
        fundingAddress,
        fundingType,
        grantSummary,
        granteeName,
    ]);

    return (
        <div className="w-full">
            {!isValid || isEditMode ? (
                <GranteeForm
                    {...document.state.global}
                    editorContext={props.editorContext}
                    dispatch={props.dispatch}
                />
            ) : (
                <GranteeDisplay
                    {...document.state.global}
                    onEdit={() => setIsEditMode(true)}
                />
            )}
        </div>
    );
};

export default Editor;
