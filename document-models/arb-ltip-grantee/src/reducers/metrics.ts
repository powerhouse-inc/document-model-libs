/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { Contract, DistributionMechanism } from '../..';
import { ArbLtipGranteeMetricsOperations } from '../../gen/metrics/operations';

class MissingFieldError extends Error {
    fields: string[];

    constructor(...fields: string[]) {
        super(`Missing required field '${fields.join('.')}'.`);
        this.fields = fields;
    }
}

export const reducer: ArbLtipGranteeMetricsOperations = {
    addActualsOperation(state, action, dispatch) {
        if (!action.input.arbReceived) {
            throw new MissingFieldError('arbReceived');
        }

        if (!action.input.arbRemaining) {
            throw new MissingFieldError('arbRemaining');
        }

        if (!action.input.arbUtilized) {
            throw new MissingFieldError('arbUtilized');
        }

        if (!action.input.summary) {
            throw new MissingFieldError('summary');
        }

        if (!action.input.disclosures) {
            throw new MissingFieldError('disclosures');
        }

        if (
            !action.input.contractsIncentivized ||
            action.input.contractsIncentivized.length === 0
        ) {
            throw new MissingFieldError('contractsIncentivized');
        }

        // inspect each contract
        const contracts: Contract[] = [];
        for (const contract of action.input.contractsIncentivized) {
            if (!contract) {
                throw new Error('Contract must be defined.');
            }

            if (!contract.contractId) {
                throw new MissingFieldError(
                    'contractsIncentivized',
                    'contractId',
                );
            }

            if (!contract.contractAddress) {
                throw new MissingFieldError(
                    'contractsIncentivized',
                    'contractAddress',
                );
            }

            if (!contract.contractLabel) {
                throw new MissingFieldError(
                    'contractsIncentivized',
                    'contractLabel',
                );
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
            throw new MissingFieldError('arbToBeDistributed');
        }

        if (!action.input.startDate) {
            throw new MissingFieldError('startDate');
        }

        if (!action.input.endDate) {
            throw new MissingFieldError('endDate');
        }

        if (!action.input.summary) {
            throw new MissingFieldError('summary');
        }

        if (!action.input.summaryOfChanges) {
            throw new MissingFieldError('summaryOfChanges');
        }

        if (
            !action.input.contractsIncentivized ||
            action.input.contractsIncentivized.length === 0
        ) {
            throw new MissingFieldError('contractsIncentivized');
        }

        // inspect each contract
        const contracts: Contract[] = [];
        for (const contract of action.input.contractsIncentivized) {
            if (!contract) {
                throw new Error('Contract must be defined.');
            }

            if (!contract.contractId) {
                throw new MissingFieldError(
                    'contractsIncentivized',
                    'contractId',
                );
            }

            if (!contract.contractAddress) {
                throw new MissingFieldError(
                    'contractsIncentivized',
                    'contractAddress',
                );
            }

            if (!contract.contractLabel) {
                throw new MissingFieldError(
                    'contractsIncentivized',
                    'contractLabel',
                );
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
                throw new Error('Distribution mechanism must be defined.');
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
            throw new MissingFieldError('avgDailyTVL');
        }

        if (!action.input.avgDailyTXNS) {
            throw new MissingFieldError('avgDailyTXNS');
        }

        if (!action.input.avgDailyVolume) {
            throw new MissingFieldError('avgDailyVolume');
        }

        if (!action.input.transactionFees) {
            throw new MissingFieldError('transactionFees');
        }

        if (!action.input.uniqueAddressesCount) {
            throw new MissingFieldError('uniqueAddressesCount');
        }

        if (!action.input.startDate) {
            throw new MissingFieldError('startDate');
        }

        if (!action.input.endDate) {
            throw new MissingFieldError('endDate');
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
