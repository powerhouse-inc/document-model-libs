import {
    FixedIncomeAsset,
    FixedIncomeAssetsTableProps,
    Icon,
    RWAAssetDetails,
    RWAFixedIncomeAssetsTable,
} from '@powerhousedao/design-system';
import { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import {
    mockFixedIncomeAssetsData,
    mockFixedIncomeTypes,
    mockSpvs,
} from './assets-mock-data';

const fieldsPriority: (keyof FixedIncomeAsset)[] = [
    'id',
    'name',
    'maturity',
    'notional',
    'coupon',
    'purchasePrice',
    'purchaseDate',
    'totalDiscount',
    'purchaseProceeds',
] as const;

export const columnCountByTableWidth = {
    1520: 12,
    1394: 11,
    1239: 10,
    1112: 9,
    984: 8,
} as const;

export const Portfolio = () => {
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [selectedAssetToEdit, setSelectedAssetToEdit] =
        useState<FixedIncomeAsset | null>(null);
    const [showNewAssetForm, setShowNewAssetForm] = useState(false);

    const toggleExpandedRow = useCallback(
        (id: string) => {
            setExpandedRowId(id === expandedRowId ? null : id);
        },
        [expandedRowId],
    );

    const onClickDetails: FixedIncomeAssetsTableProps['onClickDetails'] =
        useCallback(
            item => {
                setExpandedRowId(
                    item.id === expandedRowId ? null : item.id || null,
                );
            },
            [expandedRowId],
        );

    const onEditItem: FixedIncomeAssetsTableProps['onEditItem'] = useCallback(
        item => {
            setSelectedAssetToEdit(item);
        },
        [],
    );

    const onCancelEdit: FixedIncomeAssetsTableProps['onCancelEdit'] =
        useCallback(() => {
            setSelectedAssetToEdit(null);
        }, []);

    const onSubmitEdit: FixedIncomeAssetsTableProps['onSubmitEdit'] =
        useCallback(() => {
            setSelectedAssetToEdit(null);
        }, []);

    const onSubmitCreate: FixedIncomeAssetsTableProps['onSubmitEdit'] =
        useCallback(() => {
            setShowNewAssetForm(false);
        }, []);

    return (
        <div>
            <h1 className="text-lg font-bold mb-2">Portfolio</h1>
            <p className="text-xs text-gray-600 mb-4">
                Details on the distribution of assets among different financial
                institutions or investment vehicles.
            </p>
            <div>
                <RWAFixedIncomeAssetsTable
                    className={twMerge(
                        'bg-white',
                        expandedRowId && 'max-h-[680px]',
                    )}
                    items={mockFixedIncomeAssetsData}
                    fixedIncomeTypes={mockFixedIncomeTypes}
                    spvs={mockSpvs}
                    fieldsPriority={fieldsPriority}
                    columnCountByTableWidth={columnCountByTableWidth}
                    expandedRowId={expandedRowId}
                    selectedAssetToEdit={selectedAssetToEdit}
                    toggleExpandedRow={toggleExpandedRow}
                    onClickDetails={onClickDetails}
                    onEditItem={onEditItem}
                    onCancelEdit={onCancelEdit}
                    onSubmitEdit={onSubmitEdit}
                    footer={
                        <button
                            onClick={() => setShowNewAssetForm(true)}
                            className="flex h-[42px] text-gray-900 text-sm font-semibold justify-center items-center w-full bg-white gap-x-2"
                        >
                            <span>Create Asset</span>
                            <Icon name="plus" size={14} />
                        </button>
                    }
                />
            </div>
            {showNewAssetForm && (
                <div className="bg-white mt-4 rounded-md border border-gray-300">
                    <RWAAssetDetails
                        asset={{
                            id: '',
                            name: '',
                            fixedIncomeTypeId: mockFixedIncomeTypes[0].id,
                            spvId: mockSpvs[0].id,
                            maturity: new Date().toISOString().split('T')[0],
                            notional: 0,
                            coupon: 0,
                            purchasePrice: 0,
                            purchaseDate: '',
                            totalDiscount: 0,
                            purchaseProceeds: 0,
                            annualizedYield: 0,
                        }}
                        mode="edit"
                        operation="create"
                        fixedIncomeTypes={mockFixedIncomeTypes}
                        spvs={mockSpvs}
                        onClose={() => setShowNewAssetForm(false)}
                        onCancel={() => setShowNewAssetForm(false)}
                        onEdit={() => {}}
                        onSubmitForm={onSubmitCreate}
                        hideNonEditableFields
                    />
                </div>
            )}
        </div>
    );
};
