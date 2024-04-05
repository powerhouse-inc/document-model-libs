import { RealWorldAssetsState } from '..';

export const initialState: RealWorldAssetsState = {
    accounts: [
        {
            id: 'maker-principal-account-id',
            reference: 'MakerPrincipal',
            label: 'Principal',
        },
        {
            id: 'account-2',
            label: 'Account 2',
            reference: '0x456',
        },
        {
            id: 'account-3',
            label: 'Account 3',
            reference: '0x789',
        },
        {
            id: 'account-4',
            label: 'Account 4',
            reference: '0xabc',
        },
    ],
    principalLenderAccountId: 'maker-principal-account-id',
    spvs: [
        { id: '1', name: 'TACO' },
        { id: '2', name: 'SPV 2' },
        { id: '3', name: 'SPV 3' },
    ],
    serviceProviderFeeTypes: [
        {
            id: 'maker-principal-fee-type-id',
            name: 'Maker Principal',
            feeType: 'Principal',
            accountId: 'maker-principal-account-id',
        },
        {
            id: '1',
            feeType: 'Fee 1',
            name: 'Service Provider 1',
            accountId: 'account-2',
        },
        {
            id: '2',
            feeType: 'Fee 2',
            name: 'Service Provider 2',
            accountId: 'account-3',
        },
        {
            id: '3',
            feeType: 'Fee 3',
            name: 'Service Provider 2',
            accountId: 'account-4',
        },
    ],
    fixedIncomeTypes: [
        { id: '1', name: 'T-Bill' },
        { id: '2', name: 'U-Bill' },
        { id: '3', name: 'V-Bill' },
    ],
    portfolio: [
        {
            id: 'maker-principal-asset-id',
            spvId: '1',
            currency: 'USD',
            balance: 500000,
        },
        {
            id: '137418',
            fixedIncomeTypeId: '1',
            name: 'Fixed Income 1',
            spvId: '2',
            maturity: '2024-06-01T00:00:00.000Z',
            purchaseDate: '2021-03-28T00:00:00.000Z',
            notional: 0,
            purchasePrice: 0,
            purchaseProceeds: 0,
            totalDiscount: 0,
            ISIN: '771296973666',
            CUSIP: '225848609',
            coupon: 0,
            assetProceeds: 0,
            salesProceeds: 0,
            realizedSurplus: 0,
        },
        {
            id: '683189',
            fixedIncomeTypeId: '1',
            name: 'FixedIncome 6345',
            spvId: '2',
            maturity: '2024-06-15T00:00:00.000Z',
            purchaseDate: '2021-03-18T00:00:00.000Z',
            notional: 66561.5,
            purchasePrice: 96.61,
            purchaseProceeds: 64305.07,
            totalDiscount: 2256.43,
            ISIN: '807597117063',
            CUSIP: '303442336',
            coupon: 3.41,
            assetProceeds: 0,
            salesProceeds: 98073.04,
            realizedSurplus: 123456,
        },
        {
            id: '752165',
            fixedIncomeTypeId: '1',
            name: 'FixedIncome 1369',
            spvId: '2',
            maturity: '2022-04-24T00:00:00.000Z',
            purchaseDate: '2022-01-03T00:00:00.000Z',
            notional: 63575.76,
            purchasePrice: 84.07,
            purchaseProceeds: 53448.14,
            totalDiscount: 10127.62,
            ISIN: '466394625668',
            CUSIP: '319580691',
            coupon: 3.35,
            assetProceeds: 0,
            salesProceeds: 18994.69,
            realizedSurplus: 98765,
        },
    ],
    transactions: [],
};
