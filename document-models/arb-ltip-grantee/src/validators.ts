import { GranteeActuals, GranteePlanned, GranteeStats, Maybe } from '..';

const gtZero = (value: Maybe<number>) => null !== value && value > 0;
const gteZero = (value: Maybe<number>) => null !== value && value >= 0;
const notEmpty = (value: Maybe<string>) => !!value && value.length > 0;
const pastDate = (value: Date) => value.getTime() < Date.now();
const futureDate = (value: Date) => value.getTime() > Date.now();
function isNotEmpty<T>(value: Maybe<Array<Maybe<T>>>) {
    return !!value && value.filter(v => !!v).length > 0;
}
const isNotEmptyString = (value: Maybe<string>) => !!value && value.length > 0;

const walletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const isValidAddress = (value: string) =>
    !!value && walletAddressRegex.test(value);

const isPlannedValid = (planned: GranteePlanned) =>
    gtZero(planned.arbToBeDistributed) &&
    isNotEmpty(planned.distributionMechanism) &&
    isNotEmpty(planned.contractsIncentivized) &&
    isNotEmptyString(planned.summary) &&
    notEmpty(planned.summaryOfChanges);

const isActualsValid = (actuals: GranteeActuals) =>
    gteZero(actuals.arbReceived) &&
    gteZero(actuals.arbRemaining) &&
    gteZero(actuals.arbUtilized) &&
    isNotEmpty(actuals.contractsIncentivized) &&
    notEmpty(actuals.disclosures) &&
    isNotEmptyString(actuals.summary);

const isStatsValid = (stats: GranteeStats) =>
    gteZero(stats.avgDailyTVL) &&
    gteZero(stats.avgDailyTXNS) &&
    gteZero(stats.avgDailyVolume) &&
    gteZero(stats.transactionFees) &&
    gteZero(stats.uniqueAddressesCount);

const validators = {
    gtZero,
    gteZero,
    isValidAddress,
    isNotEmpty,
    isNotEmptyString,
    notEmpty,
    futureDate,

    isPlannedValid,
    isActualsValid,
    isStatsValid,
};
export default validators;
