/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { ArbLtipGranteeGeneralOperations } from '../../gen/general/operations';

export const reducer: ArbLtipGranteeGeneralOperations = {
    setGranteeOperation(state, action, dispatch) {
        state.id = action.input.id;
    },
    setGranteeNameOperation(state, action, dispatch) {
        state.granteeName = action.input.granteeName;
    },
    setGranteeGrantSizeOperation(state, action, dispatch) {
        state.grantSize = action.input.grantSize;
    },
    setGranteeSummaryOperation(state, action, dispatch) {
        if (!action.input.disbursementContractAddress) {
            throw new Error('disbursementContractAddress is required');
        }

        if (!action.input.fundingAddress) {
            throw new Error('fundingAddress is required');
        }

        if (!action.input.fundingType) {
            throw new Error('fundingType is required');
        }

        if (!action.input.grantSummary) {
            throw new Error('grantSummary is required');
        }

        state.disbursementContractAddress =
            action.input.disbursementContractAddress;
        state.fundingAddress = action.input.fundingAddress;
        state.fundingType = action.input.fundingType;
        state.grantSummary = action.input.grantSummary;
    },
    setGranteeMetricsDashOperation(state, action, dispatch) {
        state.metricsDashboardLink = action.input.metricsDashboardLink;
    },
};
