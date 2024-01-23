/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { RwaServiceProvider, RwaSpv } from '../..';
import { RwaPortfolioGeneralOperations } from '../../gen/general/operations';

export const reducer: RwaPortfolioGeneralOperations = {
    createSpvOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`SPV must have an id`);
        }
        if (!action.input.name) {
            throw new Error(`SPV must have a name`);
        }
        if (state.spvs.find(spv => spv.id === action.input.id)) {
            throw new Error(`SPV with id ${action.input.id} already exists!`);
        }
        state.spvs.push(action.input);
    },
    editSpvOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`SPV must have an id`);
        }
        const spv = state.spvs.find(spv => spv.id === action.input.id);
        if (!spv) {
            throw new Error(`SPV with id ${action.input.id} does not exist!`);
        }
        state.spvs = state.spvs.map(spv =>
            spv.id === action.input.id
                ? ({
                      ...spv,
                      ...action.input,
                  } as RwaSpv)
                : spv,
        );
    },
    deleteSpvOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`SPV must have an id`);
        }
        const spv = state.spvs.find(spv => spv.id === action.input.id);
        if (!spv) {
            throw new Error(`SPV with id ${action.input.id} does not exist!`);
        }
        state.spvs = state.spvs.filter(spv => spv.id !== action.input.id);
    },
    createServiceProviderOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Service provider must have an id`);
        }
        if (!action.input.name) {
            throw new Error(`Service provider must have a name`);
        }
        if (!action.input.feeType) {
            throw new Error(`Service provider must have a fee type`);
        }
        if (state.feeTypes.find(spv => spv.id === action.input.id)) {
            throw new Error(
                `Service provider with id ${action.input.id} already exists!`,
            );
        }
        state.feeTypes.push(action.input);
    },
    editServiceProviderOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Service provider must have an id`);
        }
        const spv = state.feeTypes.find(spv => spv.id === action.input.id);
        if (!spv) {
            throw new Error(
                `Service provider with id ${action.input.id} does not exist!`,
            );
        }
        state.feeTypes = state.feeTypes.map(spv =>
            spv.id === action.input.id
                ? ({
                      ...spv,
                      ...action.input,
                  } as RwaServiceProvider)
                : spv,
        );
    },
    deleteServiceProviderOperation(state, action, dispatch) {
        if (!action.input.id) {
            throw new Error(`Service provider must have an id`);
        }
        const spv = state.feeTypes.find(spv => spv.id === action.input.id);
        if (!spv) {
            throw new Error(
                `Service provider with id ${action.input.id} does not exist!`,
            );
        }
        state.feeTypes = state.feeTypes.filter(
            spv => spv.id !== action.input.id,
        );
    },
};
