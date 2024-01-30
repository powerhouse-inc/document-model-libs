/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { InputMaybe } from 'document-model/document-model';
import { z } from 'zod';
import { Asset, FixedIncome, RealWorldAssetsState } from '../..';
import { RealWorldAssetsPortfolioOperations } from '../../gen/portfolio/operations';
const dateSchema = z.coerce.date();

export function validateFixedIncomeAsset(
    state: RealWorldAssetsState,
    asset: InputMaybe<FixedIncome>,
) {
    if (
        asset?.fixedIncomeTypeId &&
        !state.fixedIncomeTypes.find(
            fixedIncomeType => fixedIncomeType.id === asset.fixedIncomeTypeId,
        )
    ) {
        throw new Error(
            `Fixed income type with id ${asset.id} does not exist!`,
        );
    }
    // todo: add validation for `name` field
    if (asset?.spvId && !state.spvs.find(spv => spv.id === asset.spvId)) {
        throw new Error(`SPV with id ${asset.id} does not exist!`);
    }
    if (asset?.maturity && !dateSchema.safeParse(asset.maturity).success) {
        throw new Error(`Maturity must be a valid date`);
    }
    if (
        asset?.purchaseDate &&
        !dateSchema.safeParse(asset.purchaseDate).success
    ) {
        throw new Error(`Purchase date must be a valid date`);
    }
}

export const reducer: RealWorldAssetsPortfolioOperations = {
    createFixedIncomeAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Fixed income asset must have an id`);
        }
        if (state.portfolio.find(asset => asset.id === action.input.id)) {
            throw new Error(`Asset with id ${action.input.id} already exists!`);
        }
        if (!action.input.fixedIncomeTypeId) {
            throw new Error(`Fixed income asset must have a type`);
        }
        if (!action.input.name) {
            throw new Error(`Fixed income asset must have a name`);
        }
        if (!action.input.spvId) {
            throw new Error(`Fixed income asset must have an SPV`);
        }
        if (!action.input.maturity) {
            throw new Error(`Fixed income asset must have a maturity`);
        }
        if (!action.input.purchaseDate) {
            throw new Error(`Fixed income asset must have a purchase date`);
        }
        if (!action.input.notional) {
            throw new Error(`Fixed income asset must have a notional`);
        }
        if (!action.input.purchaseProceeds) {
            throw new Error(`Fixed income asset must have purchase proceeds`);
        }
        validateFixedIncomeAsset(state, action.input);
        const purchasePrice =
            action.input.purchaseProceeds / action.input.notional;
        const totalDiscount =
            action.input.notional - action.input.purchaseProceeds;
        if (!action.input.marketValue) {
            throw new Error(`Fixed income asset must have market value`);
        }
        const daysToMaturity =
            new Date().getTime() - new Date(action.input.maturity).getTime();
        const annualizedYield =
            (purchasePrice / (action.input.notional - purchasePrice)) *
            (365 / daysToMaturity) *
            100;
        if (!action.input.realizedSurplus) {
            throw new Error(`Fixed income asset must have realized surplus`);
        }
        if (!action.input.totalSurplus) {
            throw new Error(`Fixed income asset must have total surplus`);
        }
        const currentValue =
            new Date().getTime() -
            new Date(action.input.purchaseDate).getTime() /
                (new Date(action.input.maturity).getTime() -
                    new Date().getTime());
        const asset = {
            ...action.input,
            purchasePrice,
            totalDiscount,
            annualizedYield,
            currentValue,
            ISIN: action.input.ISIN ?? null,
            CUSIP: action.input.CUSIP ?? null,
            coupon: action.input.coupon ?? null,
        };
        state.portfolio.push(asset);
    },
    createCashAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Cash asset must have an id`);
        }
        if (!action.input.spvId) {
            throw new Error(`Cash asset must have a spv`);
        }
        if (!action.input.currency) {
            throw new Error(`Cash asset must have a currency`);
        }
        if (!state.spvs.find(spv => spv.id === action.input.spvId)) {
            throw new Error(`SPV with id ${action.input.id} does not exist!`);
        }
        if (action.input.currency !== 'USD') {
            // todo: add support for other currencies
            throw new Error('Only USD currency is supported');
        }
        if (state.portfolio.find(asset => asset.id === action.input.id)) {
            throw new Error(`Asset with id ${action.input.id} already exists!`);
        }
        state.portfolio.push(action.input as Asset);
    },
    editFixedIncomeAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Fixed income asset must have an id`);
        }
        const asset = state.portfolio.find(
            asset => asset.id === action.input.id,
        );
        if (!asset) {
            throw new Error(`Asset with id ${action.input.id} does not exist!`);
        }
        validateFixedIncomeAsset(state, action.input);
        state.portfolio = state.portfolio.map(asset =>
            asset.id === action.input.id
                ? ({
                      ...asset,
                      ...action.input,
                  } as Asset)
                : asset,
        );
    },
    editCashAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Cash asset must have an id`);
        }
        const asset = state.portfolio.find(
            asset => asset.id === action.input.id,
        );
        if (!asset) {
            throw new Error(`Asset with id ${action.input.id} does not exist!`);
        }
        if (
            action.input.spvId &&
            !state.spvs.find(spv => spv.id === action.input.spvId)
        ) {
            throw new Error(`SPV with id ${action.input.id} does not exist!`);
        }
        if (action.input.currency && action.input.currency !== 'USD') {
            // todo: add support for other currencies
            throw new Error('Only USD currency is supported');
        }
        state.portfolio = state.portfolio.map(asset =>
            asset.id === action.input.id
                ? ({
                      ...asset,
                      ...action.input,
                  } as Asset)
                : asset,
        );
    },
    deleteFixedIncomeAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Fixed income asset must have an id`);
        }
        const asset = state.portfolio.find(
            asset => asset.id === action.input.id,
        );
        if (!asset) {
            throw new Error(`Asset with id ${action.input.id} does not exist!`);
        }
        state.portfolio = state.portfolio.filter(
            asset => asset.id !== action.input.id,
        );
    },
    deleteCashAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Fixed income asset must have an id`);
        }
        const asset = state.portfolio.find(
            asset => asset.id === action.input.id,
        );
        if (!asset) {
            throw new Error(`Asset with id ${action.input.id} does not exist!`);
        }
        state.portfolio = state.portfolio.filter(
            asset => asset.id !== action.input.id,
        );
    },
};
