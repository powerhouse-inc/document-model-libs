import {
    CashAsset,
    Fields,
    FixedIncomeAsset,
    GroupTransactionDetailInputs,
    GroupTransactionsTable,
    GroupTransactionsTableProps,
    GroupTransaction as UiGroupTransaction,
} from '@powerhousedao/design-system';
import { diff } from 'deep-object-diff';
import { utils } from 'document-model/document';
import { useCallback, useState } from 'react';
import {
    Cash,
    EditBaseTransactionInput,
    FixedIncome,
    GroupTransaction,
    isCashAsset,
    isFixedIncomeAsset,
} from '../../document-models/real-world-assets';
import {
    createGroupTransaction,
    editGroupTransaction,
} from '../../document-models/real-world-assets/gen/creators';
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
    'Entry time',
    'Cash currency',
    'Cash amount',
    'Fixed name',
    'Fixed amount',
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
        useState<UiGroupTransaction>();
    const [showNewGroupTransactionForm, setShowNewGroupTransactionForm] =
        useState(false);

    const createGroupTransactionFromFormInputs = useCallback(
        (data: GroupTransactionDetailInputs) => {
            const {
                cashAssetId,
                cashAmount,
                fixedIncomeAssetId,
                fixedIncomeAssetAmount,
                type,
            } = data;

            if (!type) throw new Error('Type is required');

            const entryTime = data.entryTime
                ? new Date(data.entryTime).toISOString()
                : new Date().toISOString();

            const cashTransaction =
                cashAssetId || cashAmount
                    ? {
                          assetId: '',
                          amount: 0,
                          entryTime,
                          counterPartyAccountId: principalLenderAccountId,
                          tradeTime: null,
                          settlementTime: null,
                          txRef: null,
                          accountId: null,
                      }
                    : null;

            if (cashTransaction && cashAssetId) {
                cashTransaction.assetId = cashAssetId;
            }

            if (cashTransaction && cashAmount) {
                cashTransaction.amount = Number(cashAmount);
            }

            const fixedIncomeTransaction =
                fixedIncomeAssetId || fixedIncomeAssetAmount
                    ? {
                          assetId: '',
                          amount: 0,
                          entryTime,
                          counterPartyAccountId: null,
                          tradeTime: null,
                          settlementTime: null,
                          txRef: null,
                          accountId: null,
                      }
                    : null;

            if (fixedIncomeTransaction && fixedIncomeAssetId) {
                fixedIncomeTransaction.assetId = fixedIncomeAssetId;
            }

            if (fixedIncomeTransaction && fixedIncomeAssetAmount) {
                fixedIncomeTransaction.amount = Number(fixedIncomeAssetAmount);
            }

            const groupTransaction = {
                type,
                cashTransaction,
                entryTime,
                fixedIncomeTransaction,
                interestTransaction: null,
                feeTransactions: null,
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

    const onSubmitEdit: GroupTransactionsTableProps['onSubmitEdit'] =
        useCallback(
            data => {
                if (!selectedGroupTransactionToEdit) return;

                const groupTransactionFromInputs =
                    createGroupTransactionFromFormInputs(data);
                const action = editGroupTransaction;
                function maybeMakeUpdatedBaseTransaction(
                    existingTransaction: EditBaseTransactionInput | null,
                    fieldsToUpdate: EditBaseTransactionInput | null,
                ) {
                    return {
                        ...existingTransaction,
                        ...fieldsToUpdate,
                    };
                }
                const cashTransaction = maybeMakeUpdatedBaseTransaction(
                    selectedGroupTransactionToEdit.cashTransaction,
                    groupTransactionFromInputs.cashTransaction,
                );
                const fixedIncomeTransaction = maybeMakeUpdatedBaseTransaction(
                    selectedGroupTransactionToEdit.fixedIncomeTransaction,
                    groupTransactionFromInputs.fixedIncomeTransaction,
                );
                const id = selectedGroupTransactionToEdit.id;
                const changedFields = diff(selectedGroupTransactionToEdit, {
                    ...groupTransactionFromInputs,
                    id,
                    cashTransaction,
                    fixedIncomeTransaction,
                });
                console.log('changedFields', changedFields);
                dispatch(action(changedFields as GroupTransaction));
                setSelectedGroupTransactionToEdit(undefined);
            },
            [
                createGroupTransactionFromFormInputs,
                dispatch,
                selectedGroupTransactionToEdit,
            ],
        );

    const onSubmitCreate: GroupTransactionsTableProps['onSubmitCreate'] =
        useCallback(
            data => {
                const transaction = createGroupTransactionFromFormInputs(data);
                const action = createGroupTransaction;
                dispatch(
                    action({
                        ...transaction,
                        id: utils.hashKey(),
                        cashTransaction: transaction.cashTransaction
                            ? {
                                  ...transaction.cashTransaction,
                                  id: utils.hashKey(),
                              }
                            : null,
                        fixedIncomeTransaction:
                            transaction.fixedIncomeTransaction
                                ? {
                                      ...transaction.fixedIncomeTransaction,
                                      id: utils.hashKey(),
                                  }
                                : null,
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
                principalLenderAccountId={principalLenderAccountId}
                setSelectedGroupTransactionToEdit={
                    setSelectedGroupTransactionToEdit
                }
                onCancelEdit={onCancelEdit}
                onSubmitEdit={onSubmitEdit}
                onSubmitCreate={onSubmitCreate}
                showNewGroupTransactionForm={showNewGroupTransactionForm}
                setShowNewGroupTransactionForm={setShowNewGroupTransactionForm}
            />
        </div>
    );
};
