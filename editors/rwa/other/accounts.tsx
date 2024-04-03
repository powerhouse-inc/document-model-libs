import {
    Account,
    AccountsTable,
    AccountsTableProps,
} from '@powerhousedao/design-system';
import { copy } from 'copy-anything';
import { utils } from 'document-model/document';
import { useCallback, useState } from 'react';
import {
    actions,
    getDifferences,
} from '../../../document-models/real-world-assets';
import { IProps } from '../editor';

export function Accounts(props: IProps) {
    const [expandedRowId, setExpandedRowId] = useState<string>();
    const [selectedItem, setSelectedItem] = useState<Account>();
    const [showNewItemForm, setShowNewItemForm] = useState(false);

    const { dispatch, document } = props;

    const accounts = document.state.global.accounts;

    const toggleExpandedRow = useCallback(
        (id: string | undefined) => {
            setExpandedRowId(curr =>
                curr && curr === expandedRowId ? undefined : id,
            );
        },
        [expandedRowId],
    );

    const onSubmitEdit: AccountsTableProps['onSubmitEdit'] = useCallback(
        data => {
            if (!selectedItem) return;

            const update = copy(selectedItem);
            const newReference = data.reference;
            const newLabel = data.label;

            if (newReference) update.reference = newReference;
            if (newLabel) update.label = newLabel;

            const changedFields = getDifferences(selectedItem, update);

            if (Object.values(changedFields).filter(Boolean).length === 0) {
                setSelectedItem(undefined);
                return;
            }

            dispatch(
                actions.editAccount({
                    ...changedFields,
                    id: selectedItem.id,
                }),
            );
            setSelectedItem(undefined);
        },
        [dispatch, selectedItem],
    );

    const onSubmitCreate: AccountsTableProps['onSubmitCreate'] = useCallback(
        data => {
            const id = utils.hashKey();
            const reference = data.reference;
            const label = data.label;
            if (!reference) throw new Error('Reference is required');

            dispatch(
                actions.createAccount({
                    id,
                    reference,
                    label,
                }),
            );
            setShowNewItemForm(false);
        },
        [dispatch],
    );

    return (
        <AccountsTable
            accounts={accounts}
            selectedItem={selectedItem}
            showNewItemForm={showNewItemForm}
            expandedRowId={expandedRowId}
            toggleExpandedRow={toggleExpandedRow}
            setSelectedItem={setSelectedItem}
            setShowNewItemForm={setShowNewItemForm}
            onSubmitEdit={onSubmitEdit}
            onSubmitCreate={onSubmitCreate}
        />
    );
}
