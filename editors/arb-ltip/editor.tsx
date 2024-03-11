import { EditorProps } from 'document-model/document';
import {
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState,
    ArbLtipGranteeState,
} from '../../document-models/arb-ltip-grantee';
import { RWATabsProps } from '@powerhousedao/design-system';
import { useMemo, useState } from 'react';
import './style.css';
import GranteeForm from './components/GranteeForm';
import GranteeDisplay from './components/GranteeDisplay';
import GranteeStats from './components/GranteeStats';
import PhaseDisplay from './components/PhaseDisplay';
import { classNames } from './util';

export type CustomEditorProps = Pick<
    RWATabsProps,
    'onClose' | 'onExport' | 'onSwitchboardLinkClick'
>;

export type IProps = EditorProps<
    ArbLtipGranteeState,
    ArbLtipGranteeAction,
    ArbLtipGranteeLocalState
>;

type TabHeaderProps = { active: string; setActive: (a: string) => void };
const TabHeader = ({ active, setActive }: TabHeaderProps) => {
    const tabs = [
        {
            name: 'Summary',
        },
        {
            name: 'Current Phase',
        },
        {
            name: 'Historical',
        },
    ];

    return (
        <div className="border-b border-gray-200">
            <nav className="flex justify-center space-x-8" aria-label="Tabs">
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
            </nav>
        </div>
    );
};

const Editor = (props: IProps) => {
    const { document } = props;
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
        <div className="w-full">
            {!isValid || isEditMode ? (
                <GranteeForm
                    {...document.state.global}
                    editorContext={props.editorContext}
                    dispatch={props.dispatch}
                    onClose={() => setIsEditMode(false)}
                />
            ) : (
                <>
                    <TabHeader active={activeTab} setActive={setActiveTab} />
                    {activeTab === 'Summary' && (
                        <GranteeDisplay
                            {...document.state.global}
                            onEdit={() => setIsEditMode(true)}
                        />
                    )}
                    {activeTab === 'Current Phase' && (
                        <PhaseDisplay {...props} />
                    )}
                    {activeTab === 'Historical' && <PhaseDisplay {...props} />}
                </>
            )}
        </div>
    );
};

export default Editor;
