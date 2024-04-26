import { Phase } from '../..';
import { ArbLtipGranteeGeneralOperations } from '../../gen/general/operations';
import { isAdminRole, isEditorRole } from '../tests/util';
import validators from '../validators';

export const reducer: ArbLtipGranteeGeneralOperations = {
    initGranteeOperation(state, action, dispatch) {
        // this operation is public, but can only happen once
        if (
            state.authorizedSignerAddress !== null &&
            state.authorizedSignerAddress !== undefined &&
            validators.isValidAddress(state.authorizedSignerAddress)
        ) {
            throw new Error('Grantee already initialized');
        }

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

        if (!validators.isNotEmptyString(grantSummary)) {
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
        const signer = action.context?.signer?.user.address;
        if (!signer) {
            throw new Error(`Unauthorized signer`);
        }

        const {
            // editor or admin
            fundingAddress,
            fundingType,
            granteeName,
            grantSummary,
            metricsDashboardLink,
            matchingGrantSize,

            // admin only
            grantSize,
            authorizedSignerAddress,
            disbursementContractAddress,
        } = action.input;

        // must be at least an editor to do anything
        const isEditor = isEditorRole(state, signer);
        if (!isEditor) {
            throw new Error(`Unauthorized signer`);
        }

        // editor or admin
        {
            if (fundingAddress) {
                if (!validators.isValidAddress(fundingAddress)) {
                    throw new Error('fundingAddress is invalid');
                }

                state.fundingAddress = fundingAddress;
            }

            if (fundingType) {
                state.fundingType = fundingType;
            }

            if (granteeName) {
                state.granteeName = granteeName;
            }

            if (grantSummary) {
                state.grantSummary = grantSummary;
            }

            if (matchingGrantSize != null && matchingGrantSize !== undefined) {
                state.matchingGrantSize = matchingGrantSize;
            }

            if (metricsDashboardLink) {
                state.metricsDashboardLink = metricsDashboardLink;
            }
        }

        // admin only
        const isAdmin = isAdminRole(state, signer);
        if (isAdmin) {
            if (grantSize != null && grantSize !== undefined) {
                if (!validators.gtZero(grantSize)) {
                    throw new Error('grantSize must be greater than 0');
                }
                state.grantSize = grantSize;
            }

            if (authorizedSignerAddress) {
                if (!validators.isValidAddress(authorizedSignerAddress)) {
                    throw new Error('authorizedSignerAddress is invalid');
                }

                // move current signer to editor
                if (!state.editorAddresses) {
                    state.editorAddresses = [];
                }
                state.editorAddresses.push(signer);

                // if new signer is an editor, remove them
                const newSignerIndex = state.editorAddresses.indexOf(
                    authorizedSignerAddress,
                );
                if (newSignerIndex !== -1) {
                    state.editorAddresses.splice(newSignerIndex, 1);
                }

                // save signer
                state.authorizedSignerAddress = authorizedSignerAddress;
            }

            if (disbursementContractAddress) {
                if (!validators.isValidAddress(disbursementContractAddress)) {
                    throw new Error('disbursementContractAddress is invalid');
                }

                state.disbursementContractAddress = disbursementContractAddress;
            }
        }
    },
};
