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
        state.grantSummary = action.input.grantSummary;
    },
    setGranteeMetricsOperation(state, action, dispatch) {
        state.metricsDashboardLink = action.input.metricsDashboardLink;
    },
};
