/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { RwaPortfolioGeneralOperations } from '../../gen/general/operations';

// TODO: Implement "isValidSpvName" function
function isValidSpvName(potentialName: string) {
    return potentialName.length > 0;
}

// TODO: Implement "isValidServiceProviderName" function
function isValidServiceProviderName(potentialName: string) {
    return potentialName.length > 0;
}

// TODO: Implement "isValidServiceProviderCategory" function
function isValidServiceProviderCategory(potentialCategory: string) {
    return potentialCategory.length > 0;
}

export const reducer: RwaPortfolioGeneralOperations = {
    createSpvOperation(state, action, dispatch) {
        if (!action.input.id || !action.input.name) {
            throw new Error('Id and name are required');
        }

        if (state.spvs.find(spv => spv.id === action.input.id)) {
            throw new Error(`SPV with id ${action.input.id} already exists!`);
        }

        if (!isValidSpvName(action.input.name)) {
            throw new Error(`Invalid SPV name: ${action.input.name}`);
        }

        state.spvs.push({
            ...action.input,
        });
    },
    editSpvOperation(state, action, dispatch) {
        const spv = state.spvs.find(spv => spv.id === action.input.id);
        if (!spv) {
            throw new Error(`SPV with id ${action.input.id} not found`);
        }

        if (!isValidSpvName(action.input.name)) {
            throw new Error(`Invalid SPV name: ${action.input.name}`);
        }

        spv.name = action.input.name;
    },
    deleteSpvOperation(state, action, dispatch) {
        const spv = state.spvs.find(spv => spv.id === action.input.id);
        if (!spv) {
            throw new Error(`SPV with id ${action.input.id} not found`);
        }
        state.spvs = state.spvs.filter(spv => spv.id !== action.input.id);
    },
    addServiceProviderOperation(state, action, dispatch) {
        // TODO: ServiceProvider type must be added and state needs serviceProviders array
    },
    editServiceProviderOperation(state, action, dispatch) {
        // TODO: Implement "editServiceProviderOperation" reducer
        throw new Error(
            'Reducer "editServiceProviderOperation" not yet implemented',
        );
    },
    deleteServiceProviderOperation(state, action, dispatch) {
        // TODO: Implement "deleteServiceProviderOperation" reducer
        throw new Error(
            'Reducer "deleteServiceProviderOperation" not yet implemented',
        );
    },
};
