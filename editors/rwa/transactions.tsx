import {
    CashAsset,
    Fields,
    FixedIncomeAsset,
    GroupTransaction,
    GroupTransactionDetailInputs,
    GroupTransactionDetails,
    GroupTransactionsTable,
    GroupTransactionsTableProps,
    Icon,
} from '@powerhousedao/design-system';
import { utils } from 'document-model/document';
import { useCallback, useState } from 'react';
import {
    Cash,
    FixedIncome,
    actions,
    isCashAsset,
    isFixedIncomeAsset,
} from '../../document-models/real-world-assets';
import { IProps } from './editor';

const columnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
};

const fieldsPriority: (keyof Fields)[] = [
    'Transaction type',
    'Cash currency',
    'Cash amount',
    'Cash entry time',
    'Fixed name',
    'Fixed amount',
    'Fixed entry time',
];

export const Transactions = (props: IProps) => {
    const { dispatch, document } = props;

    const transactions = document.state.global.transactions;

    const fixedIncomeAssets = document.state.global.portfolio
        .filter((asset): asset is FixedIncome => isFixedIncomeAsset(asset))
        .map(item => ({
            ...item,
            maturity: item.maturity.split('T')[0],
            purchaseDate: item.purchaseDate.split('T')[0],
        })) as FixedIncomeAsset[];

    const cashAssets = document.state.global.portfolio.filter(
        (asset): asset is Cash => isCashAsset(asset),
    ) as CashAsset[];

    const principalLenderAccountId =
        document.state.global.principalLenderAccountId;

    const [expandedRowId, setExpandedRowId] = useState<string>();
    const [selectedGroupTransactionToEdit, setSelectedGroupTransactionToEdit] =
        useState<GroupTransaction>();
    const [showNewGroupTransactionForm, setShowNewGroupTransactionForm] =
        useState(false);

    const createGroupTransactionFromFormInputs = useCallback(
        (data: GroupTransactionDetailInputs) => {
            const cashTransaction = {
                assetId: data.cashAssetId,
                amount: data.cashAmount,
                entryTime: data.cashEntryTime.toString() + 'T00:00:00.000Z',
                counterPartyAccountId: principalLenderAccountId,
                tradeTime: null,
                settlementTime: null,
                txRef: null,
                accountId: null,
            };
            const fixedIncomeTransaction = {
                assetId: data.fixedIncomeAssetId,
                amount: data.fixedIncomeAssetAmount,
                entryTime:
                    data.fixedIncomeAssetEntryTime.toString() +
                    'T00:00:00.000Z',
                counterPartyAccountId: null,
                tradeTime: null,
                settlementTime: null,
                txRef: null,
                accountId: null,
            };
            const groupTransaction = {
                type: 'AssetPurchaseGroupTransaction',
                cashTransaction,
                fixedIncomeTransaction,
            };
            return groupTransaction;
        },
        [principalLenderAccountId],
    );

    const toggleExpandedRow = useCallback((id: string) => {
        setExpandedRowId(curr => (id === curr ? undefined : id));
    }, []);

    const onClickDetails: GroupTransactionsTableProps['onClickDetails'] =
        useCallback(() => {}, []);

    const onCancelEdit: GroupTransactionsTableProps['onCancelEdit'] =
        useCallback(() => {
            setSelectedGroupTransactionToEdit(undefined);
        }, []);

    const onSubmitEdit: GroupTransactionsTableProps['onSubmitForm'] =
        useCallback(data => {
            console.log('edit', { data });
            setSelectedGroupTransactionToEdit(undefined);
        }, []);

    const onSubmitCreate: GroupTransactionsTableProps['onSubmitForm'] =
        useCallback(
            data => {
                console.log('create', { data });
                const transaction = createGroupTransactionFromFormInputs(data);
                dispatch(
                    actions.createAssetPurchaseGroupTransaction({
                        ...transaction,
                        id: utils.hashKey(),
                        cashTransaction: {
                            ...transaction.cashTransaction,
                            id: utils.hashKey(),
                        },
                        fixedIncomeTransaction: {
                            ...transaction.fixedIncomeTransaction,
                            id: utils.hashKey(),
                        },
                    }),
                );
                setShowNewGroupTransactionForm(false);
            },
            [createGroupTransactionFromFormInputs, dispatch],
        );

    return (
        <div>
            <h1 className="text-lg font-bold mb-2">Transactions</h1>
            <p className="text-xs text-gray-600 mb-4">
                Details of this portfolios transactions
            </p>
            <GroupTransactionsTable
                columnCountByTableWidth={columnCountByTableWidth}
                fieldsPriority={fieldsPriority}
                fixedIncomeAssets={fixedIncomeAssets}
                cashAssets={cashAssets}
                items={transactions}
                expandedRowId={expandedRowId}
                toggleExpandedRow={toggleExpandedRow}
                onClickDetails={onClickDetails}
                selectedGroupTransactionToEdit={selectedGroupTransactionToEdit}
                onCancelEdit={onCancelEdit}
                onSubmitEdit={onSubmitEdit}
                onSubmitCreate={onSubmitCreate}
                showNewGroupTransactionForm={showNewGroupTransactionForm}
                setShowNewGroupTransactionForm={setShowNewGroupTransactionForm}
                createNewButton={
                    <button
                        onClick={() => setShowNewGroupTransactionForm(true)}
                        className="flex p-2 text-gray-900 text-sm font-semibold justify-center items-center w-full bg-white gap-x-2 rounded-lg"
                    >
                        <span>Create Group Transaction</span>
                        <Icon name="plus" size={14} />
                    </button>
                }
            />
            {showNewGroupTransactionForm && (
                <div className="mt-4 rounded-md border border-gray-300 bg-white">
                    <GroupTransactionDetails
                        transaction={{
                            id: '',
                            type: 'AssetPurchaseGroupTransaction',
                            cashTransaction: {
                                id: '',
                                assetId: cashAssets[0].id,
                                amount: 1000,
                                entryTime: '2024-01-01',
                                counterPartyAccountId: principalLenderAccountId,
                            },
                            fixedIncomeTransaction: {
                                id: '',
                                assetId: fixedIncomeAssets[0].id,
                                amount: 1000,
                                entryTime: '2024-01-01',
                            },
                        }}
                        fixedIncomeAssets={fixedIncomeAssets}
                        cashAssets={cashAssets}
                        principalLenderId={principalLenderAccountId}
                        operation="create"
                        onCancel={() => setShowNewGroupTransactionForm(false)}
                        onSubmitForm={onSubmitCreate}
                        hideNonEditableFields
                    />
                </div>
            )}
        </div>
    );
};
