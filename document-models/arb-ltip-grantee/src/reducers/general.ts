/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { Phase } from '../..';
import { ArbLtipGranteeGeneralOperations } from '../../gen/general/operations';
import validators from '../validators';

export const reducer: ArbLtipGranteeGeneralOperations = {
    initGranteeOperation(state, action, dispatch) {
        const {
            authorizedSignerAddress,
            disbursementContractAddress,
            fundingAddress,
            fundingType,
            grantSize,
            matchingGrantSize,
            grantSummary,
            granteeName,
            metricsDashboardLink,
            startDate,
            numberOfPhases,
            phaseDuration,
        } = action.input;

        if (!validators.isValidAddress(authorizedSignerAddress)) {
            throw new Error('authorizedSignerAddress is invalid');
        }

        if (!validators.isValidAddress(disbursementContractAddress)) {
            throw new Error('disbursementContractAddress is invalid');
        }

        if (!validators.isValidAddress(fundingAddress)) {
            throw new Error('fundingAddress is required');
        }

        if (!validators.gtZero(grantSize)) {
            throw new Error('grantSize must be greater than 0');
        }

        if (!validators.isSummaryValid(grantSummary)) {
            throw new Error('grantSummary is required');
        }

        if (!validators.isNotEmptyString(granteeName)) {
            throw new Error('granteeName is required');
        }

        state.authorizedSignerAddress = authorizedSignerAddress;
        state.disbursementContractAddress = disbursementContractAddress;
        state.fundingAddress = fundingAddress;
        state.fundingType = fundingType;
        state.grantSize = grantSize;
        state.matchingGrantSize = matchingGrantSize;
        state.grantSummary = grantSummary;
        state.granteeName = granteeName;
        state.metricsDashboardLink = metricsDashboardLink;

        if (!numberOfPhases) {
            throw new Error('numberOfPhases is required');
        }

        if (!phaseDuration) {
            throw new Error('phaseDuration is required');
        }

        if (numberOfPhases <= 0 || numberOfPhases > 10) {
            throw new Error('numberOfPhases must be in [0, 10]');
        }

        if (phaseDuration < 1 || phaseDuration > 31) {
            throw new Error('phaseDuration must be in than [1, 31]');
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
    editGranteeOperation(state, action, dispatch) {
        const {
            authorizedSignerAddress,
            disbursementContractAddress,
            fundingAddress,
            fundingType,
            grantSize,
            grantSummary,
            granteeName,
            matchingGrantSize,
            metricsDashboardLink,
        } = action.input;

        if (authorizedSignerAddress) {
            if (!validators.isValidAddress(authorizedSignerAddress)) {
                throw new Error('authorizedSignerAddress is invalid');
            }
            state.authorizedSignerAddress = authorizedSignerAddress;
        }

        if (disbursementContractAddress) {
            if (!validators.isValidAddress(disbursementContractAddress)) {
                throw new Error('disbursementContractAddress is invalid');
            }
            state.disbursementContractAddress = disbursementContractAddress;
        }

        if (fundingAddress) {
            if (!validators.isValidAddress(fundingAddress)) {
                throw new Error('fundingAddress is required');
            }
            state.fundingAddress = fundingAddress;
        }

        if (fundingType) {
            state.fundingType = fundingType;
        }

        if (grantSize) {
            if (!validators.gtZero(grantSize)) {
                throw new Error('grantSize must be greater than 0');
            }
            state.grantSize = grantSize;
        }

        if (grantSummary) {
            if (!validators.isSummaryValid(grantSummary)) {
                throw new Error('grantSummary is required');
            }
            state.grantSummary = grantSummary;
        }

        if (granteeName) {
            if (!validators.isNotEmptyString(granteeName)) {
                throw new Error('granteeName is required');
            }
            state.granteeName = granteeName;
        }

        if (matchingGrantSize) {
            state.matchingGrantSize = matchingGrantSize;
        }

        if (metricsDashboardLink) {
            state.metricsDashboardLink = metricsDashboardLink;
        }
    },
};
