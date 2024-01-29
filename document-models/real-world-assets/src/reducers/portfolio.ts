/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { z } from 'zod';
import { Asset } from '../..';
import { RealWorldAssetsPortfolioOperations } from '../../gen/portfolio/operations';

export const reducer: RealWorldAssetsPortfolioOperations = {
    createFixedIncomeAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Fixed income asset must have an id`);
        }
        if (!action.input.type) {
            throw new Error(`Fixed income asset must have a type`);
        }
        if (!action.input.name) {
            throw new Error(`Fixed income asset must have a name`);
        }
        if (!action.input.maturity) {
            throw new Error(`Fixed income asset must have a maturity`);
        }
        if (state.portfolio.find(asset => asset.id === action.input.id)) {
            throw new Error(`Asset with id ${action.input.id} already exists!`);
        }
        if (!state.fixedIncomeTypes.find(fia => fia.id === action.input.type)) {
            throw new Error(
                `Fixed income type with id ${action.input.id} does not exist!`,
            );
        }
        const dateSchema = z.coerce.date();
        if (!dateSchema.safeParse(action.input.maturity).success) {
            throw new Error(`Maturity must be a valid date`);
        }
        state.portfolio.push(action.input as Asset);
    },
    createCashAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Cash asset must have an id`);
        }
        if (!action.input.spv) {
            throw new Error(`Cash asset must have a spv`);
        }
        if (!action.input.currency) {
            throw new Error(`Cash asset must have a currency`);
        }
        if (!state.spvs.find(spv => spv.id === action.input.spv)) {
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
        if (
            action.input.type &&
            !state.fixedIncomeTypes.find(fia => fia.id === action.input.type)
        ) {
            throw new Error(
                `Fixed income type with id ${action.input.id} does not exist!`,
            );
        }
        if (action.input.maturity) {
            const dateSchema = z.coerce.date();
            if (!dateSchema.safeParse(action.input.maturity).success) {
                throw new Error(`Maturity must be a valid date`);
            }
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
            action.input.spv &&
            !state.spvs.find(spv => spv.id === action.input.spv)
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