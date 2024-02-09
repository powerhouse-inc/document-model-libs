import { getLocalTimeZone } from '@internationalized/date';
import {
    FixedIncomeAsset,
    FixedIncomeAssetsTableProps,
    Icon,
    RWAAssetDetails,
    RWAFixedIncomeAssetsTable,
} from '@powerhousedao/design-system';
import { RWAAssetDetailInputs } from '@powerhousedao/design-system/dist/rwa/components/asset-details/form';
import { utils } from 'document-model/document';
import { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { actions } from '../../document-models/real-world-assets';
import {
    mockFixedIncomeAssetsData,
    mockFixedIncomeTypes,
    mockSpvs,
} from './assets-mock-data';
import { IProps } from './editor';

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

function createAssetFromFormInputs(data: RWAAssetDetailInputs) {
    const spvId = data.spv.id;
    const fixedIncomeTypeId = data.fixedIncomeType.id;
    const maturity = data.maturity.toDate(getLocalTimeZone()).toISOString();
    return {
        ...data,
        spvId,
        fixedIncomeTypeId,
        maturity,
    };
}

export const Portfolio = (props: IProps) => {
    const [expandedRowId, setExpandedRowId] = useState<string>();
    const [selectedAssetToEdit, setSelectedAssetToEdit] =
        useState<FixedIncomeAsset>();
    const [showNewAssetForm, setShowNewAssetForm] = useState(false);

    const { dispatch } = props;

    console.log({ dispatch });

    const toggleExpandedRow = useCallback(
        (id: string) => {
            setExpandedRowId(id === expandedRowId ? undefined : id);
        },
        [expandedRowId],
    );

    const onClickDetails: FixedIncomeAssetsTableProps['onClickDetails'] =
        useCallback(
            item => {
                setExpandedRowId(
                    item.id === expandedRowId
                        ? undefined
                        : item.id || undefined,
                );
            },
            [expandedRowId],
        );

    const onCancelEdit: FixedIncomeAssetsTableProps['onCancelEdit'] =
        useCallback(() => {
            setSelectedAssetToEdit(undefined);
        }, []);

    const onSubmitEdit: FixedIncomeAssetsTableProps['onSubmitForm'] =
        useCallback(
            data => {
                if (!selectedAssetToEdit) return;
                const asset = createAssetFromFormInputs(data);
                dispatch(
                    actions.editFixedIncomeAsset({
                        ...asset,
                        id: selectedAssetToEdit.id,
                    }),
                );
                setSelectedAssetToEdit(undefined);
            },
            [dispatch, selectedAssetToEdit],
        );

    const onSubmitCreate: FixedIncomeAssetsTableProps['onSubmitForm'] =
        useCallback(
            data => {
                const asset = createAssetFromFormInputs(data);
                dispatch(
                    actions.createFixedIncomeAsset({
                        ...asset,
                        id: utils.hashKey(),
                    }),
                );
                setShowNewAssetForm(false);
            },
            [dispatch],
        );

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
                    setSelectedAssetToEdit={setSelectedAssetToEdit}
                    onCancelEdit={onCancelEdit}
                    onSubmitForm={onSubmitEdit}
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
                        onSubmitForm={onSubmitCreate}
                        hideNonEditableFields
                    />
                </div>
            )}
        </div>
    );
};
