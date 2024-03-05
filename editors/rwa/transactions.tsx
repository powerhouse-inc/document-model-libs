import {
    CashAsset,
    Fields,
    FixedIncomeAsset,
    GroupTransactionDetailInputs,
    GroupTransactionsTable,
    GroupTransactionsTableProps,
    GroupTransaction as UiGroupTransaction,
} from '@powerhousedao/design-system';
import { utils } from 'document-model/document';
import { useCallback, useState } from 'react';
import {
    BaseTransaction,
    Cash,
    FixedIncome,
    getDifferences,
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
    'Entry time',
    'Asset',
    'Quantity',
    'USD Amount',
    'Cash Balance Change',
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

    // there is only one cash asset for v1
    const cashAsset = cashAssets[0];

    const principalLenderAccountId =
        document.state.global.principalLenderAccountId;

    const feeTypes = document.state.global.feeTypes;

    const [expandedRowId, setExpandedRowId] = useState<string>();
    const [selectedGroupTransactionToEdit, setSelectedGroupTransactionToEdit] =
        useState<UiGroupTransaction>();
    const [showNewGroupTransactionForm, setShowNewGroupTransactionForm] =
        useState(false);

    const createNewGroupTransactionFromFormInputs = useCallback(
        (data: GroupTransactionDetailInputs) => {
            const {
                cashAmount,
                fixedIncomeAssetId,
                fixedIncomeAssetAmount,
                type,
            } = data;

            if (!type) throw new Error('Type is required');
            if (!data.entryTime) throw new Error('Entry time is required');

            const entryTime = new Date(data.entryTime).toISOString();

            const fees =
                data.fees?.map(fee => ({
                    ...fee,
                    amount: Number(fee.amount),
                })) ?? null;

            const cashTransaction = cashAmount
                ? {
                      id: utils.hashKey(),
                      assetId: cashAsset.id,
                      entryTime,
                      counterPartyAccountId: principalLenderAccountId,
                      amount: Number(cashAmount),
                      settlementTime: null,
                      tradeTime: null,
                      txRef: null,
                  }
                : null;

            if (fixedIncomeAssetId && !fixedIncomeAssetAmount) {
                throw new Error('Fixed income asset amount is required');
            }
            if (fixedIncomeAssetAmount && !fixedIncomeAssetId) {
                throw new Error('Fixed income asset ID is required');
            }
            const fixedIncomeTransaction =
                fixedIncomeAssetId && fixedIncomeAssetAmount
                    ? {
                          id: utils.hashKey(),
                          assetId: fixedIncomeAssetId,
                          amount: Number(fixedIncomeAssetAmount),
                          entryTime,
                          counterPartyAccountId: null,
                          settlementTime: null,
                          tradeTime: null,
                          txRef: null,
                      }
                    : null;

            const groupTransaction = {
                id: utils.hashKey(),
                type,
                cashTransaction,
                entryTime,
                fees,
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

                const newEntryTime = data.entryTime
                    ? new Date(data.entryTime).toISOString()
                    : undefined;
                const newType = data.type;
                const newFixedIncomeAssetId = data.fixedIncomeAssetId;
                const newFixedIncomeAssetAmount = data.fixedIncomeAssetAmount
                    ? Number(data.fixedIncomeAssetAmount)
                    : undefined;
                const newCashAmount = data.cashAmount
                    ? Number(data.cashAmount)
                    : undefined;
                const newFees = data.fees
                    ? data.fees.map(fee => ({
                          ...fee,
                          amount: Number(fee.amount),
                      }))
                    : undefined;

                const existingCashTransaction =
                    selectedGroupTransactionToEdit.cashTransaction;

                const existingFixedIncomeTransaction =
                    selectedGroupTransactionToEdit.fixedIncomeTransaction;

                if (
                    !existingCashTransaction ||
                    !existingFixedIncomeTransaction
                ) {
                    throw new Error(
                        'This group transaction was misconfigured, fixed income or cash transaction is missing',
                    );
                }

                let update = {
                    ...selectedGroupTransactionToEdit,
                };

                if (newType) {
                    update = {
                        ...update,
                        type: newType,
                    };
                }

                if (newEntryTime) {
                    update = {
                        ...update,
                        entryTime: newEntryTime,
                    };
                }

                // use direct comparison to avoid false positives on zero
                if (newCashAmount !== undefined) {
                    update = {
                        ...update,
                        cashTransaction: {
                            ...existingCashTransaction,
                            amount: newCashAmount,
                        },
                    };
                }

                if (newFixedIncomeAssetId) {
                    update = {
                        ...update,
                        fixedIncomeTransaction: {
                            ...existingFixedIncomeTransaction,
                            assetId: newFixedIncomeAssetId,
                        },
                    };
                }

                // use direct comparison to avoid false positives on zero
                if (newFixedIncomeAssetAmount !== undefined) {
                    update = {
                        ...update,
                        fixedIncomeTransaction: {
                            ...existingFixedIncomeTransaction,
                            amount: newFixedIncomeAssetAmount,
                        },
                    };
                }

                if (newFees) {
                    update = {
                        ...update,
                        fees: newFees,
                    };
                }

                let changedFields = getDifferences(
                    selectedGroupTransactionToEdit,
                    update,
                );

                if ('fixedIncomeTransaction' in changedFields) {
                    const fixedIncomeTransactionChangedFields = getDifferences(
                        existingFixedIncomeTransaction,
                        update.fixedIncomeTransaction,
                    ) as BaseTransaction;

                    changedFields = {
                        ...changedFields,
                        fixedIncomeTransaction: {
                            ...fixedIncomeTransactionChangedFields,
                            id: existingFixedIncomeTransaction.id,
                        },
                    };
                }

                if ('cashTransaction' in changedFields) {
                    const cashTransactionChangedFields = getDifferences(
                        existingCashTransaction,
                        update.cashTransaction,
                    ) as BaseTransaction;

                    changedFields = {
                        ...changedFields,
                        cashTransaction: {
                            ...cashTransactionChangedFields,
                            id: existingCashTransaction.id,
                        },
                    };
                }

                if (Object.keys(changedFields).length === 0) return;

                dispatch(
                    editGroupTransaction({
                        ...changedFields,
                        id: selectedGroupTransactionToEdit.id,
                    }),
                );

                setSelectedGroupTransactionToEdit(undefined);
            },
            [dispatch, selectedGroupTransactionToEdit],
        );

    const onSubmitCreate: GroupTransactionsTableProps['onSubmitCreate'] =
        useCallback(
            data => {
                const transaction =
                    createNewGroupTransactionFromFormInputs(data);

                dispatch(createGroupTransaction(transaction));
                setShowNewGroupTransactionForm(false);
            },
            [createNewGroupTransactionFromFormInputs, dispatch],
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
                feeTypes={feeTypes}
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
