export type TXMock = (typeof txMockData)[0];

export const txMockData = [
    {
        id: '1',
        timestamp: '2021-10-01',
        assetTypeId: '912796YJ2',
        quantity: 100,
        amount: 10000,
        cashBalanceChange: 105000000,
        transactionType: 'purchase',
        assetProceedsUSD: 1000000,
        unitPrice: 99,
        fees: [
            {
                id: '1',
                serviceProvider: 'Celadon',
                feeType: 'Broker Fee',
                accountID: 'BE 0090...2039312',
                fee: 7,
            },
            {
                id: '2',
                serviceProvider: 'Exchange Agent',
                feeType: 'Forex',
                accountID: '0x71C7...f6d8976F',
                fee: 100,
            },
        ],
    },
    {
        id: '2',
        timestamp: '2021-10-02',
        assetTypeId: '912796YJ2',
        quantity: 10000,
        amount: 34000,
        cashBalanceChange: 14300000,
        transactionType: 'purchase',
        assetProceedsUSD: 700000,
        unitPrice: 10,
        fees: [
            {
                id: '1',
                serviceProvider: 'Celadon',
                feeType: 'Broker Fee',
                accountID: 'BE 0090...2039312',
                fee: 2,
            },
            {
                id: '2',
                serviceProvider: 'Exchange Agent',
                feeType: 'Forex',
                accountID: '0x71C7...f6d8976F',
                fee: 100,
            },
        ],
    },
    {
        id: '3',
        timestamp: '2021-10-03',
        assetTypeId: '912796YJ2',
        quantity: 10,
        amount: 8000,
        cashBalanceChange: 77824000,
        transactionType: 'purchase',
        assetProceedsUSD: 28833,
        unitPrice: 99,
        fees: [
            {
                id: '1',
                serviceProvider: 'Celadon',
                feeType: 'Broker Fee',
                accountID: 'BE 0090...2039312',
                fee: 99,
            },
            {
                id: '2',
                serviceProvider: 'Exchange Agent',
                feeType: 'Forex',
                accountID: '0x71C7...f6d8976F',
                fee: 78,
            },
        ],
    },
    {
        id: '4',
        timestamp: '2021-10-04',
        assetTypeId: '912796YJ2',
        quantity: 100,
        amount: 10000,
        cashBalanceChange: 77824000,
        transactionType: 'purchase',
        assetProceedsUSD: 1000000,
        unitPrice: 99,
        fees: [
            {
                id: '1',
                serviceProvider: 'Celadon',
                feeType: 'Broker Fee',
                accountID: 'BE 0090...2039312',
                fee: 7,
            },
            {
                id: '2',
                serviceProvider: 'Exchange Agent',
                feeType: 'Forex',
                accountID: '0x71C7...f6d8976F',
                fee: 100,
            },
        ],
    },
    {
        id: '5',
        timestamp: '2021-10-05',
        assetTypeId: '912796YJ2',
        quantity: 10000,
        amount: 34000,
        cashBalanceChange: 77824000,
        transactionType: 'purchase',
        assetProceedsUSD: 700000,
        unitPrice: 10,
        fees: [
            {
                id: '1',
                serviceProvider: 'Celadon',
                feeType: 'Broker Fee',
                accountID: 'BE 0090...2039312',
                fee: 2,
            },
            {
                id: '2',
                serviceProvider: 'Exchange Agent',
                feeType: 'Forex',
                accountID: '0x71C7...f6d8976F',
                fee: 100,
            },
        ],
    },
    {
        id: '6',
        timestamp: '2021-10-06',
        assetTypeId: '912796YJ2',
        quantity: 10,
        amount: 8000,
        cashBalanceChange: 77824000,
        transactionType: 'purchase',
        assetProceedsUSD: 28833,
        unitPrice: 99,
        fees: [
            {
                id: '1',
                serviceProvider: 'Celadon',
                feeType: 'Broker Fee',
                accountID: 'BE 0090...2039312',
                fee: 99,
            },
            {
                id: '2',
                serviceProvider: 'Exchange Agent',
                feeType: 'Forex',
                accountID: '0x71C7...f6d8976F',
                fee: 78,
            },
        ],
    },
    {
        id: '7',
        timestamp: '2021-10-07',
        assetTypeId: '912796YJ2',
        quantity: 100,
        amount: 10000,
        cashBalanceChange: 77824000,
        transactionType: 'purchase',
        assetProceedsUSD: 1000000,
        unitPrice: 99,
        fees: [
            {
                id: '1',
                serviceProvider: 'Celadon',
                feeType: 'Broker Fee',
                accountID: 'BE 0090...2039312',
                fee: 7,
            },
            {
                id: '2',
                serviceProvider: 'Exchange Agent',
                feeType: 'Forex',
                accountID: '0x71C7...f6d8976F',
                fee: 100,
            },
        ],
    },
];
