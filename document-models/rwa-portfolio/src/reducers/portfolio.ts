/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { z } from 'zod';
import { RwaAsset } from '../..';
import { RwaPortfolioPortfolioOperations } from '../../gen/portfolio/operations';

export const reducer: RwaPortfolioPortfolioOperations = {
    createRwaFixedIncomeAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`RWA fixed income asset must have an id`);
        }
        if (!action.input.type) {
            throw new Error(`RWA fixed income asset must have a type`);
        }
        if (!action.input.name) {
            throw new Error(`RWA fixed income asset must have a name`);
        }
        if (!action.input.maturity) {
            throw new Error(`RWA fixed income asset must have a maturity`);
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
        state.portfolio.push(action.input as RwaAsset);
    },
    createRwaCashAssetOperation(state, action, dispatch) {
        // TODO: Implement "createRwaCashAssetOperation" reducer
        throw new Error(
            'Reducer "createRwaCashAssetOperation" not yet implemented',
        );
    },
    editRwaFixedIncomeAssetOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`RWA fixed income asset must have an id`);
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
                  } as RwaAsset)
                : asset,
        );
    },
    editRwaCashAssetOperation(state, action, dispatch) {
        // TODO: Implement "editRwaCashAssetOperation" reducer
        throw new Error(
            'Reducer "editRwaCashAssetOperation" not yet implemented',
        );
    },
    deleteRwaFixedIncomeAssetOperation(state, action, dispatch) {
        // TODO: Implement "deleteRwaFixedIncomeAssetOperation" reducer
        throw new Error(
            'Reducer "deleteRwaFixedIncomeAssetOperation" not yet implemented',
        );
    },
    deleteRwaCashAssetOperation(state, action, dispatch) {
        // TODO: Implement "deleteRwaCashAssetOperation" reducer
        throw new Error(
            'Reducer "deleteRwaCashAssetOperation" not yet implemented',
        );
    },
};
