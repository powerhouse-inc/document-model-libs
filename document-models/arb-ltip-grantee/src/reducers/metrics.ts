/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { Contract, DistributionMechanism } from '../..';
import { ArbLtipGranteeMetricsOperations } from '../../gen/metrics/operations';

export const reducer: ArbLtipGranteeMetricsOperations = {
    addActualsOperation(state, action, dispatch) {
        if (!action.input.arbReceived) {
            throw new Error(`Actuals must have arbReceived`);
        }

        if (!action.input.arbRemaining) {
            throw new Error(`Actuals must have arbRemaining`);
        }

        if (!action.input.arbUtilized) {
            throw new Error(`Actuals must have arbUtilized`);
        }

        if (!action.input.summary) {
            throw new Error(`Actuals must have summary`);
        }

        if (!action.input.disclosures) {
            throw new Error(`Actuals must have disclosures`);
        }

        if (
            !action.input.contractsIncentivized ||
            action.input.contractsIncentivized.length === 0
        ) {
            throw new Error(`Actuals must have contractsIncentivized`);
        }

        // inspect each contract
        const contracts: Contract[] = [];
        for (const contract of action.input.contractsIncentivized) {
            if (!contract) {
                throw new Error(`Actuals must have contractsIncentivized`);
            }

            if (!contract.contractId) {
                throw new Error(`Contract must have contractId`);
            }

            if (!contract.contractAddress) {
                throw new Error(`Contract must have contractAddress`);
            }

            if (!contract.contractLabel) {
                throw new Error(`Contract must have contractLabel`);
            }

            contracts.push(contract);
        }

        if (!state.actuals) {
            state.actuals = [];
        }

        state.actuals.push({
            arbReceived: action.input.arbReceived,
            arbRemaining: action.input.arbRemaining,
            arbUtilized: action.input.arbUtilized,
            contractsIncentivized: contracts,
            disclosures: action.input.disclosures,
            endDate: action.input.endDate,
            startDate: action.input.startDate,
            summary: action.input.summary,
        });
    },
    addPlannedOperation(state, action, dispatch) {
        if (!action.input.arbToBeDistributed) {
            throw new Error(`Planned must have arbToBeDistributed`);
        }

        if (!action.input.startDate) {
            throw new Error(`Planned must have startDate`);
        }

        if (!action.input.endDate) {
            throw new Error(`Planned must have endDate`);
        }

        if (!action.input.summary) {
            throw new Error(`Planned must have summary`);
        }

        if (!action.input.summaryOfChanges) {
            throw new Error(`Planned must have summaryOfChanges`);
        }

        if (
            !action.input.contractsIncentivized ||
            action.input.contractsIncentivized.length === 0
        ) {
            throw new Error(`Planned must have contractsIncentivized`);
        }

        // inspect each contract
        const contracts: Contract[] = [];
        for (const contract of action.input.contractsIncentivized) {
            if (!contract) {
                throw new Error(`Planned must have contractsIncentivized`);
            }

            if (!contract.contractId) {
                throw new Error(`Contract must have contractId`);
            }

            if (!contract.contractAddress) {
                throw new Error(`Contract must have contractAddress`);
            }

            if (!contract.contractLabel) {
                throw new Error(`Contract must have contractLabel`);
            }

            contracts.push(contract);
        }

        if (
            !action.input.distributionMechanism ||
            action.input.distributionMechanism.length === 0
        ) {
            throw new Error(`Planned must have distributionMechanism`);
        }

        // inspect each distribution mechanism
        const distributionMechanisms: DistributionMechanism[] = [];
        for (const distributionMechanism of action.input
            .distributionMechanism) {
            if (!distributionMechanism) {
                throw new Error(`Planned must have distributionMechanism`);
            }

            distributionMechanisms.push(distributionMechanism);
        }

        if (!state.planned) {
            state.planned = [];
        }

        state.planned.push({
            arbToBeDistributed: action.input.arbToBeDistributed,
            contractsIncentivized: contracts,
            distributionMechanism: distributionMechanisms,
            endDate: action.input.endDate,
            startDate: action.input.startDate,
            summary: action.input.summary,
            summaryOfChanges: action.input.summaryOfChanges,
        });
    },
    addStatsOperation(state, action, dispatch) {
        if (!action.input.avgDailyTVL) {
            throw new Error(`Stats must have avgDailyTVL`);
        }

        if (!action.input.avgDailyTXNS) {
            throw new Error(`Stats must have avgDailyTXNS`);
        }

        if (!action.input.avgDailyVolume) {
            throw new Error(`Stats must have avgDailyVolume`);
        }

        if (!action.input.transactionFees) {
            throw new Error(`Stats must have transactionFees`);
        }

        if (!action.input.uniqueAddressesCount) {
            throw new Error(`Stats must have uniqueAddressesCount`);
        }

        if (!action.input.startDate) {
            throw new Error(`Stats must have startDate`);
        }

        if (!action.input.endDate) {
            throw new Error(`Stats must have endDate`);
        }

        if (!state.stats) {
            state.stats = [];
        }

        state.stats.push({
            avgDailyTVL: action.input.avgDailyTVL,
            avgDailyTXNS: action.input.avgDailyTXNS,
            avgDailyVolume: action.input.avgDailyVolume,
            transactionFees: action.input.transactionFees,
            uniqueAddressesCount: action.input.uniqueAddressesCount,
            startDate: action.input.startDate,
            endDate: action.input.endDate,
        });
    },
};
