import { EditorProps } from 'document-model/document';
import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
} from '../../document-models/arb-ltip-grantee';
import { Icon, RWATabsProps } from '@powerhousedao/design-system';
import { useMemo, useState } from 'react';
import GranteeForm from './components/forms/GranteeForm';
import TabTodo from './components/tabs/TabTodo';
import { classNames } from './util';
import { actions } from 'document-model/document-model';
import TabSummary from './components/tabs/TabSummary';
import TabHistorical from './components/tabs/TabHistorical';

export type CustomEditorProps = Pick<
    RWATabsProps,
    'onClose' | 'onExport' | 'onSwitchboardLinkClick'
>;

export type IProps = EditorProps<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState
> &
    CustomEditorProps;

type TabHeaderProps = { active: string; setActive: (a: string) => void } & Pick<
    IProps,
    'onExport' | 'onClose'
>;
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
            name: 'Todo',
        },
        {
            name: 'Historical',
        },
    ];

    return (
        <div className="border-b border-gray-200">
            <nav className="flex justify-center space-x-8" aria-label="Tabs">
                <div className="flex-1 flex space-x-2 pt-4"></div>

                {tabs.map(tab => (
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
                ))}

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
    const { document, onClose, onExport } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('Summary');

    const {
        disbursementContractAddress,
        fundingAddress,
        fundingType,
        grantSummary,
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
        <div className="w-[840px] mx-auto [&_input]:outline-none [&_textarea]:outline-none">
            {!isValid || isEditMode ? (
                <>
                    <ControlsHeader {...props} />
                    <GranteeForm
                        {...document.state.global}
                        editorContext={props.editorContext}
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
                            onOpenHistorical={() => setActiveTab('Historical')}
                        />
                    )}
                    {activeTab === 'Todo' && <TabTodo {...props} />}
                    {activeTab === 'Historical' && <TabHistorical {...props} />}
                </>
            )}
        </div>
    );
};

export default Editor;
