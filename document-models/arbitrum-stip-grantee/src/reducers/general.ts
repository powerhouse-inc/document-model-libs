import { Phase } from '../..';
import { ArbitrumStipGranteeGeneralOperations } from '../../gen/general/operations';
import {
    fromCommaDelimitedString,
    isAdminRole,
    isEditorRole,
    toCommaDelimitedString,
} from '../utils';
import validators from '../validators';

export const reducer: ArbitrumStipGranteeGeneralOperations = {
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

        // required fields
        if (!validators.isValidAddress(authorizedSignerAddress)) {
            throw new Error('authorizedSignerAddress is invalid');
        }

        if (!validators.gtZero(grantSize)) {
            throw new Error('grantSize must be greater than 0');
        }

        if (!validators.isNotEmptyString(granteeName)) {
            throw new Error('granteeName is required');
        }

        const disbursementAddresses = fromCommaDelimitedString(
            disbursementContractAddress,
        );
        if (disbursementAddresses.length < 1) {
            throw new Error('disbursementContractAddress is required');
        }

        if (
            disbursementAddresses.some(addr => !validators.isValidAddress(addr))
        ) {
            throw new Error(
                'disbursementContractAddress is improperly formatted',
            );
        }

        const fundingAddresses = fromCommaDelimitedString(fundingAddress);
        if (fundingAddresses.length < 1) {
            throw new Error('fundingAddress is required');
        }

        if (fundingAddresses.some(addr => !validators.isValidAddress(addr))) {
            throw new Error('fundingAddress is improperly formatted');
        }

        state.authorizedSignerAddress = authorizedSignerAddress;
        state.disbursementContractAddress = toCommaDelimitedString(
            disbursementAddresses,
        );
        state.fundingAddress = toCommaDelimitedString(fundingAddresses);
        state.fundingType = fundingType;
        state.grantSize = grantSize;
        state.matchingGrantSize = matchingGrantSize;
        state.granteeName = granteeName;

        // optional fields
        if (grantSummary) {
            state.grantSummary = grantSummary;
        }

        if (metricsDashboardLink) {
            state.metricsDashboardLink = metricsDashboardLink;
        }

        // phase handling
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
                    incentives: '',
                    disclosures: '',
                    summary: '',
                },
                planned: {
                    arbToBeDistributed: 0,
                    contractsIncentivized: [],
                    distributionMechanism: [],
                    changes: '',
                    expectations: '',
                },
                stats: {
                    avgDailyTVL: 0,
                    avgDailyTXNS: 0,
                    avgDailyUniqueUsers: 0,
                    changes: '',
                    lessons: '',
                    kpis: [],
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
                const fundingAddresses =
                    fromCommaDelimitedString(fundingAddress);
                if (fundingAddresses.length < 1) {
                    throw new Error('fundingAddress is required');
                }

                if (
                    fundingAddresses.some(
                        addr => !validators.isValidAddress(addr),
                    )
                ) {
                    throw new Error('fundingAddress is improperly formatted');
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
                const disbursementContractAddresses = fromCommaDelimitedString(
                    disbursementContractAddress,
                );

                if (disbursementContractAddresses.length < 1) {
                    throw new Error('disbursementContractAddress is required');
                }

                if (
                    disbursementContractAddresses.some(
                        addr => !validators.isValidAddress(addr),
                    )
                ) {
                    throw new Error(
                        'disbursementContractAddress is improperly formatted',
                    );
                }

                state.disbursementContractAddress = disbursementContractAddress;
            }
        }
    },
};
