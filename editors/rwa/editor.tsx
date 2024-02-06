import { useState } from 'react';
import { Key } from 'react-aria-components';
import { EditorProps } from 'document-model/document';
import {
    RealWorldAssetsState,
    RealWorldAssetsLocalState,
    RealWorldAssetsAction,
} from '../../document-models/real-world-assets';
import { TabPanel } from 'react-aria-components';
import { RWATabs } from '@powerhousedao/design-system';

export type IProps = EditorProps<
    RealWorldAssetsState,
    RealWorldAssetsAction,
    RealWorldAssetsLocalState
>;

function Editor(props: IProps) {
    const { document, dispatch } = props;

    const [activeTab, setActiveTab] = useState<Key>('portfolio');

    return (
        <RWATabs
            selectedKey={activeTab}
            onSelectionChange={key => setActiveTab(key)}
            tabs={[
                { id: 'portfolio', label: 'Portfolio' },
                { id: 'transactions', label: 'Transactions' },
                { id: 'attachments', label: 'Attachments' },
            ]}
        >
            <div className="mt-4 flex h-[200px] items-center justify-center rounded-lg bg-gray-100">
                <TabPanel id="portfolio">Portfolio Content</TabPanel>
                <TabPanel id="transactions">Transactions Content</TabPanel>
                <TabPanel id="attachments">Attachments Content</TabPanel>
            </div>
        </RWATabs>
    );
}

export default Editor;
