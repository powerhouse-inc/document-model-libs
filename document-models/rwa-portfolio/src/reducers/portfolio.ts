/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { RwaAsset, RwaCash, RwaFixedIncome } from '../..';
import { RwaPortfolioPortfolioOperations } from '../../gen/portfolio/operations';

export const reducer: RwaPortfolioPortfolioOperations = {
    addRwaFixedIncomeAssetOperation(state, action, dispatch) {
        if (
            !action.input.id ||
            !action.input.type ||
            !action.input.name ||
            !action.input.maturity
        ) {
            throw new Error('Id, type, name, and maturity are required');
        }

        if (isNaN(new Date(action.input.maturity).getTime())) {
            throw new Error(`Invalid maturity date: ${action.input.maturity}`);
        }

        if (
            !state.fixedIncomeTypes.find(
                asset => asset.id === action.input.type,
            )
        ) {
            throw new Error(`Asset type ${action.input.type} not found`);
        }

        state.portfolio.push({
            ...action.input,
        } as RwaAsset);
    },
    addRwaCashAssetOperation(state, action, dispatch) {
        if (Object.values(action.input).some(value => !value)) {
            throw new Error('Id, spv and currency are required');
        }

        if (!state.spvs.find(spv => spv.id === action.input.spv)) {
            throw new Error(`SPV ${action.input.spv} not found`);
        }

        state.portfolio.push({
            ...action.input,
        } as RwaAsset);
    },
    editRwaFixedIncomeAssetOperation(state, action, dispatch) {
        if (
            !action.input.id ||
            !action.input.type ||
            !action.input.name ||
            !action.input.maturity
        ) {
            throw new Error('Id, type, name, and maturity are required');
        }
        const asset = state.portfolio.find(
            asset => asset.id === action.input.id,
        ) as RwaFixedIncome | undefined;
        if (!asset) {
            throw new Error(`Asset with id ${action.input.id} not found`);
        }

        if (isNaN(new Date(action.input.maturity).getTime())) {
            throw new Error(`Invalid maturity date: ${action.input.maturity}`);
        }

        if (
            !state.fixedIncomeTypes.find(
                asset => asset.id === action.input.type,
            )
        ) {
            throw new Error(`Asset type ${action.input.type} not found`);
        }

        asset.type = action.input.type;
        asset.name = action.input.name;
        asset.ISIN = action.input.ISIN ?? asset.ISIN;
        asset.CUSIP = action.input.CUSIP ?? asset.CUSIP;
        asset.coupon = action.input.coupon ?? asset.coupon;
        asset.maturity = action.input.maturity;
    },
    editRwaCashAssetOperation(state, action, dispatch) {
        if (!action.input.id || !action.input.spv || !action.input.currency) {
            throw new Error('Id, spv and currency are required');
        }

        const asset = state.portfolio.find(
            asset => asset.id === action.input.id,
        ) as RwaCash | undefined;
        if (!asset) {
            throw new Error(`Asset with id ${action.input.id} not found`);
        }

        if (!state.spvs.find(spv => spv.id === action.input.spv)) {
            throw new Error(`SPV ${action.input.spv} not found`);
        }

        asset.spv = action.input.spv;
        asset.currency = action.input.currency;
    },
    deleteRwaFixedIncomeAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Id is required');
        }

        const asset = state.portfolio.find(
            asset => asset.id === action.input.id,
        );

        if (!asset) {
            throw new Error(`Asset with id ${action.input.id} not found`);
        }

        state.portfolio = state.portfolio.filter(
            asset => asset.id !== action.input.id,
        );
    },
    deleteRwaCashAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error('Id is required');
        }

        const asset = state.portfolio.find(
            asset => asset.id === action.input.id,
        );

        if (!asset) {
            throw new Error(`Asset with id ${action.input.id} not found`);
        }

        state.portfolio = state.portfolio.filter(
            asset => asset.id !== action.input.id,
        );
    },
};
