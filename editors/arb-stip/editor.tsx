import { EditorProps } from 'document-model/document';
import {
    ArbitrumStipGranteeLocalState,
    ArbitrumStipGranteeAction,
    ArbitrumStipGranteeState,
} from '../../document-models/arbitrum-stip-grantee';
import { Icon, RWATabsProps } from '@powerhousedao/design-system';
import { useMemo, useState } from 'react';
import GranteeForm from './components/forms/GranteeForm';
import TabTodo from './components/tabs/TabTodo';
import { classNames } from './util';
import { actions } from 'document-model/document-model';
import TabSummary from './components/tabs/TabSummary';
import TabHistorical from './components/tabs/TabHistorical';
import TabAdmin from './components/tabs/TabAdmin';
import { UserProvider } from './components/UserProvider';
import useIsAdmin from './hooks/use-is-admin';
import useIsEditor from './hooks/use-is-editor';

export type CustomEditorProps = Pick<
    RWATabsProps,
    'onClose' | 'onExport' | 'onSwitchboardLinkClick'
>;

export type IProps = EditorProps<
    ArbitrumStipGranteeState,
    ArbitrumStipGranteeAction,
    ArbitrumStipGranteeLocalState
> &
    CustomEditorProps;

type TabHeaderProps = {
    active: string;
    setActive: (a: string) => void;
} & Pick<IProps, 'onExport' | 'onClose'>;
const TabHeader = ({
    active,
    setActive,
    onClose,
    onExport,
}: TabHeaderProps) => {
    const tabs = [
        {
            name: 'Summary',
        },
        {
            name: 'Historical',
        },
    ];

    const isAdmin = useIsAdmin();
    if (isAdmin) {
        tabs.push({
            name: 'Admin',
        });
    }

    const isEditor = useIsEditor();
    if (isEditor) {
        tabs.splice(1, 0, {
            name: 'Todo',
        });
    }

    const tabElements = useMemo(
        () =>
            tabs.map(tab => (
                <p
                    key={tab.name}
                    className={classNames(
                        tab.name === active
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                        'cursor-pointer whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium',
                    )}
                    aria-current={tab.name === active ? 'page' : undefined}
                    onClick={() => setActive(tab.name)}
                >
                    {tab.name}
                </p>
            )),
        [active],
    );

    return (
        <div className="border-b border-gray-200">
            <nav className="block sm:hidden" aria-label="Tabs">
                <div className="flex space-x-4 w-full pb-4">
                    <Icon name="arrow-left" onClick={onClose} />
                    <div className="flex-1" />
                    <Icon
                        className="cursor-pointer"
                        name="save"
                        onClick={onExport}
                    />
                    <Icon
                        className="cursor-pointer"
                        name="xmark"
                        onClick={onClose}
                    />
                </div>
                <div className="flex space-x-8 justify-center">
                    {tabElements}
                </div>
            </nav>
            <nav className="hidden sm:flex space-x-8" aria-label="Tabs">
                <div className="flex-1 cursor-pointer flex items-center">
                    <Icon name="arrow-left" onClick={onClose} />
                </div>

                <div className="flex-1 flex space-x-8 justify-center">
                    {tabElements}
                </div>

                <div className="flex-1 flex space-x-2 justify-end pt-4">
                    <div>
                        <Icon
                            className="cursor-pointer"
                            name="save"
                            onClick={onExport}
                        />
                    </div>
                    <div>
                        <Icon
                            className="cursor-pointer"
                            name="xmark"
                            onClick={onClose}
                        />
                    </div>
                </div>
            </nav>
        </div>
    );
};

const ControlsHeader = ({ dispatch, onClose, onExport }: IProps) => {
    const undo = () => dispatch(actions.undo());
    const redo = () => dispatch(actions.redo());

    return (
        <div className="w-full flex space-x-2">
            <div>
                <Icon
                    className="cursor-pointer"
                    name="arrow-left"
                    onClick={onClose}
                />
            </div>
            <div>
                <Icon
                    className="hidden -scale-x-100 cursor-pointer"
                    name="redo-arrow"
                    onClick={undo}
                />
            </div>
            <div>
                <Icon
                    className="hidden cursor-pointer"
                    name="redo-arrow"
                    onClick={redo}
                />
            </div>
            <div className="flex-1"></div>
            <div>
                <Icon
                    className="cursor-pointer"
                    name="save"
                    onClick={onExport}
                />
            </div>
            <div>
                <Icon
                    className="cursor-pointer"
                    name="xmark"
                    onClick={onClose}
                />
            </div>
        </div>
    );
};

const Editor = (props: IProps) => {
    const { context, document, onClose, onExport } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('Summary');

    const {
        disbursementContractAddress,
        fundingAddress,
        fundingType,
        granteeName,
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

        if (!granteeName) {
            return false;
        }

        return true;
    }, [disbursementContractAddress, fundingAddress, fundingType, granteeName]);

    return (
        <UserProvider user={context.user} state={document.state.global}>
            <div className="lg:w-[840px] mx-auto [&_input]:outline-none [&_textarea]:outline-none">
                {!isValid || isEditMode ? (
                    <>
                        <ControlsHeader {...props} />
                        <GranteeForm
                            {...document.state.global}
                            context={props.context}
                            dispatch={props.dispatch}
                            onClose={() => setIsEditMode(false)}
                        />
                    </>
                ) : (
                    <>
                        <TabHeader
                            active={activeTab}
                            setActive={setActiveTab}
                            onClose={onClose}
                            onExport={onExport}
                        />
                        {activeTab === 'Summary' && (
                            <TabSummary
                                {...document.state.global}
                                onEdit={() => setIsEditMode(true)}
                                onOpenHistorical={() =>
                                    setActiveTab('Historical')
                                }
                            />
                        )}
                        {activeTab === 'Todo' && <TabTodo {...props} />}
                        {activeTab === 'Historical' && (
                            <TabHistorical {...props} />
                        )}
                        {activeTab === 'Admin' && <TabAdmin {...props} />}
                    </>
                )}
            </div>
        </UserProvider>
    );
};

export default Editor;
