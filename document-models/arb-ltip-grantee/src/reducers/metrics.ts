/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { Phase } from '../..';
import { ArbLtipGranteeMetricsOperations } from '../../gen/metrics/operations';
import validators from '../validators';

export const reducer: ArbLtipGranteeMetricsOperations = {
    initPhaseOperation(state, action, dispatch) {
        const { startDate, numberOfPhases, phaseDuration } = action.input;
        if (!startDate) {
            throw new Error('startDate is required');
        }

        if (!numberOfPhases) {
            throw new Error('numberOfPhases is required');
        }

        if (!phaseDuration) {
            throw new Error('phaseDuration is required');
        }

        if (numberOfPhases <= 0 || numberOfPhases > 10) {
            throw new Error('numberOfPhases must be in [0, 10]');
        }

        if (phaseDuration <= 0 || phaseDuration > 10) {
            throw new Error('phaseDuration must be in than [0, 10]');
        }

        const phases = [];
        for (let i = 0; i < numberOfPhases; i++) {
            const phaseStartDate = new Date(startDate);
            phaseStartDate.setDate(
                phaseStartDate.getDate() + i * phaseDuration,
            );

            const phaseEndDate = new Date(startDate);
            phaseEndDate.setDate(
                phaseEndDate.getDate() + (i + 1) * phaseDuration,
            );

            const phaseStartDateString = phaseStartDate.toISOString();
            const phaseEndDateString = phaseEndDate.toISOString();

            const phase: Phase = {
                startDate: phaseStartDateString,
                endDate: phaseEndDateString,
                status: 'NotStarted',
                actuals: {
                    arbReceived: 0,
                    arbRemaining: 0,
                    arbUtilized: 0,
                    contractsIncentivized: [],
                    disclosures: '',
                    summary: '',
                },
                planned: {
                    arbToBeDistributed: 0,
                    contractsIncentivized: [],
                    distributionMechanism: [],
                    summary: '',
                    summaryOfChanges: '',
                },
                stats: {
                    avgDailyTVL: 0,
                    avgDailyTXNS: 0,
                    avgDailyVolume: 0,
                    transactionFees: 0,
                    uniqueAddressesCount: 0,
                },
            };

            phases.push(phase);
        }

        state.phases = phases;
    },
    editPhaseOperation(state, action, dispatch) {
        const { status, actuals, planned, stats, phaseIndex } = action.input;
        if (phaseIndex === undefined || phaseIndex === null) {
            throw new Error('phaseIndex is required');
        }

        if (!state.phases) {
            throw new Error('state phases are uninitialized');
        }

        if (phaseIndex < 0 || phaseIndex >= state.phases.length) {
            throw new Error('phaseIndex must be within the range of phases');
        }

        const phase = state.phases[phaseIndex];
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
