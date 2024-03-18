import {
    Contract,
    DistributionMechanism,
    GranteePlanned,
    Maybe,
    Phase,
} from '..';

const validators = {
    isDisbursementValid: (value: Maybe<number>) => !!value && value > 0,
    isDistributionMechanismsValid: (
        value: Maybe<Array<Maybe<DistributionMechanism>>>,
    ) => !!value && value.filter(v => !!v).length > 0,
    isContractsValid: (value: Maybe<Array<Maybe<Contract>>>) =>
        !!value && value.filter(v => !!v).length > 0,
    isSummaryValid: (value: Maybe<string>) => !!value && value.length > 0,
    isSummaryOfChangesValid: (value: Maybe<string>) =>
        !!value && value.length > 0,
    isStartDateValid: (value: Date) => value.getTime() > Date.now(),
    isEndDateValid: (value: Date) => value.getTime() > Date.now(),
    isPlannedValid: (planned: GranteePlanned) => {
        return (
            validators.isDisbursementValid(planned.arbToBeDistributed) &&
            validators.isDistributionMechanismsValid(
                planned.distributionMechanism,
            ) &&
            validators.isContractsValid(planned.contractsIncentivized) &&
            validators.isSummaryValid(planned.summary) &&
            validators.isSummaryOfChangesValid(planned.summaryOfChanges)
        );
    },
};

export default validators;
