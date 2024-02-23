import {
    CashAsset,
    Fields,
    FixedIncomeAsset,
    GroupTransaction,
    GroupTransactionDetailInputs,
    GroupTransactionsTable,
    GroupTransactionsTableProps,
} from '@powerhousedao/design-system';
import { utils } from 'document-model/document';
import { useCallback, useState } from 'react';
import {
    Cash,
    FixedIncome,
    GroupTransactionType,
    actions,
    isCashAsset,
    isFixedIncomeAsset,
} from '../../document-models/real-world-assets';
import {
    ASSET_PURCHASE,
    ASSET_SALE,
    FEES_PAYMENT,
    INTEREST_DRAW,
    INTEREST_RETURN,
    PRINCIPAL_DRAW,
    PRINCIPAL_RETURN,
} from '../../document-models/real-world-assets/src/constants';
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

function getCreateActionForGroupTransactionType(type: GroupTransactionType) {
    switch (type) {
        case ASSET_PURCHASE:
            return actions.createAssetPurchaseGroupTransaction;
        case ASSET_SALE:
            return actions.createAssetSaleGroupTransaction;
        case INTEREST_DRAW:
            return actions.createInterestDrawGroupTransaction;
        case INTEREST_RETURN:
            return actions.createInterestReturnGroupTransaction;
        case PRINCIPAL_DRAW:
            return actions.createPrincipalDrawGroupTransaction;
        case PRINCIPAL_RETURN:
            return actions.createPrincipalReturnGroupTransaction;
        case FEES_PAYMENT:
            return actions.createFeesPaymentGroupTransaction;
    }
}

function getEditActionForGroupTransactionType(type: GroupTransactionType) {
    switch (type) {
        case ASSET_PURCHASE:
            return actions.editAssetPurchaseGroupTransaction;
        case ASSET_SALE:
            return actions.editAssetSaleGroupTransaction;
        case INTEREST_DRAW:
            return actions.editInterestDrawGroupTransaction;
        case INTEREST_RETURN:
            return actions.editInterestReturnGroupTransaction;
        case PRINCIPAL_DRAW:
            return actions.editPrincipalDrawGroupTransaction;
        case PRINCIPAL_RETURN:
            return actions.editPrincipalReturnGroupTransaction;
        case FEES_PAYMENT:
            // todo: implement edit reducers for fees
            return actions.editPrincipalDrawGroupTransaction;
    }
}

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
            if (!data.type) {
                throw new Error('Transaction type is required');
            }
            const cashTransaction = {
                assetId: data.cashAssetId,
                amount: Number(data.cashAmount),
                entryTime: data.entryTime,
                counterPartyAccountId: principalLenderAccountId,
                tradeTime: null,
                settlementTime: null,
                txRef: null,
                accountId: null,
            };
            const fixedIncomeTransaction = {
                assetId: data.fixedIncomeAssetId,
                amount: Number(data.fixedIncomeAssetAmount),
                entryTime: data.entryTime,
                counterPartyAccountId: null,
                tradeTime: null,
                settlementTime: null,
                txRef: null,
                accountId: null,
            };
            const groupTransaction = {
                type: data.type,
                cashTransaction,
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

                const transaction = createGroupTransactionFromFormInputs(data);
                const action = getEditActionForGroupTransactionType(data.type!);
                dispatch(
                    action({
                        ...transaction,
                        id: selectedGroupTransactionToEdit.id,
                        cashTransaction: {
                            ...transaction.cashTransaction,
                            id: selectedGroupTransactionToEdit.cashTransaction
                                .id,
                        },
                        fixedIncomeTransaction: {
                            ...transaction.fixedIncomeTransaction,
                            id: selectedGroupTransactionToEdit
                                .fixedIncomeTransaction.id,
                        },
                    }),
                );
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
                console.log('create', { data });
                const transaction = createGroupTransactionFromFormInputs(data);
                const action = getCreateActionForGroupTransactionType(
                    data.type!,
                );
                dispatch(
                    action({
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
                setSelectedGroupTransactionToEdit={
                    setSelectedGroupTransactionToEdit
                }
                onCancelEdit={onCancelEdit}
                onSubmitForm={onSubmitEdit}
                onSubmitCreate={onSubmitCreate}
                showNewGroupTransactionForm={showNewGroupTransactionForm}
                setShowNewGroupTransactionForm={setShowNewGroupTransactionForm}
            />
        </div>
    );
};
