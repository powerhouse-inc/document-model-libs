import {
    GranteeActuals,
    GranteePlanned,
    GranteeStats,
    Maybe,
    fromCommaDelimitedString,
} from '..';

const gtZero = (value: Maybe<number>) => null !== value && value > 0;
const gteZero = (value: Maybe<number>) => null !== value && value >= 0;
const futureDate = (value: Date) => value.getTime() > Date.now();
function isNotEmpty<T>(value: Maybe<Array<Maybe<T>>>) {
    return !!value && value.filter(v => !!v).length > 0;
}
const isNotEmptyString = (value: Maybe<string>) => !!value && value.length > 0;

const walletAddressRegex = /^0x[a-fA-F0-9]{40}$/;
const isValidAddress = (value: string) =>
    !!value && walletAddressRegex.test(value);
const isValidAddressList = (value: string) => {
    const addresses = fromCommaDelimitedString(value);
    return addresses.length > 0 && addresses.every(isValidAddress);
};

const isPlannedValid = (planned: GranteePlanned) =>
    gteZero(planned.arbToBeDistributed) &&
    isNotEmpty(planned.distributionMechanism) &&
    isNotEmptyString(planned.expectations) &&
    isNotEmptyString(planned.changes);

const isActualsValid = (actuals: GranteeActuals) =>
    gteZero(actuals.arbReceived) &&
    gteZero(actuals.arbUtilized) &&
    isNotEmptyString(actuals.disclosures) &&
    isNotEmptyString(actuals.summary);

const isStatsValid = (stats: GranteeStats) =>
    gteZero(stats.avgDailyTVL) &&
    gteZero(stats.avgDailyTXNS) &&
    gteZero(stats.avgDailyUniqueUsers);

const validators = {
    gtZero,
    gteZero,
    isValidAddress,
    isValidAddressList,
    isNotEmpty,
    isNotEmptyString,
    futureDate,

    isPlannedValid,
    isActualsValid,
    isStatsValid,
};
export default validators;
