/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { ArbLtipGranteeMetricsOperations } from '../../gen/metrics/operations';
import { isEditorRole } from '../tests/util';
import validators from '../validators';

export const reducer: ArbLtipGranteeMetricsOperations = {
    editPhaseOperation(state, action, dispatch) {
        const signer = action.context?.signer?.user.address;
        if (!isEditorRole(state, signer)) {
            throw new Error(`Unauthorized signer`);
        }

        const { status, actuals, planned, stats, phaseIndex } = action.input;
        const { phases } = state;

        if (!phases || phases.length === 0) {
            throw new Error('state phases are uninitialized');
        }
        if (phaseIndex < 0 || phaseIndex >= phases.length) {
            throw new Error('phaseIndex is invalid');
        }

        const phase = phases[phaseIndex];
        if (!phase) {
            throw new Error('phase is not found');
        }

        if (status) {
            phase.status = status;
        }

        if (actuals) {
            phase.actuals = actuals;
        }

        if (planned) {
            if (validators.isPlannedValid(planned)) {
                phase.planned = planned;
            } else {
                throw new Error('planned is not valid');
            }
        }

        if (stats) {
            phase.stats = stats;
        }
    },
};
