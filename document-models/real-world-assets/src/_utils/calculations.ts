import { BaseTransaction, GroupTransaction } from '../..';

export function roundToNearestDay(date: Date) {
    // Convert to UTC date components
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    const hours = date.getUTCHours();

    // Create a new date at the start of the current day in UTC
    let roundedDate = new Date(Date.UTC(year, month, day));

    // If the original time was past midday (12 hours), advance the roundedDate by one day
    if (hours >= 12) {
        roundedDate = new Date(roundedDate.getTime() + 24 * 60 * 60 * 1000); // Add one day in milliseconds
    }

    return roundedDate;
}

export function computeFixedIncomeAssetDerivedFields(
    assetPurchaseFixedIncomeTransactions: BaseTransaction[],
    assetSaleFixedIncomeTransactions: BaseTransaction[],
    groupTransactions: GroupTransaction[],
) {
    const allFixedIncomeTransactions = [
        ...assetPurchaseFixedIncomeTransactions,
        ...assetSaleFixedIncomeTransactions,
    ];
    const notional = calculateNotional(
        assetPurchaseFixedIncomeTransactions,
        assetSaleFixedIncomeTransactions,
    );
    const purchaseProceeds = calculatePurchaseProceeds(
        assetPurchaseFixedIncomeTransactions,
        groupTransactions,
    );
    const salesProceeds = calculateSalesProceeds(
        assetSaleFixedIncomeTransactions,
    );
    const realizedSurplus = calculateRealizedSurplus(
        salesProceeds,
        purchaseProceeds,
    );
    const purchasePrice = calculatePurchasePrice(notional, purchaseProceeds);
    const totalDiscount = calculateTotalDiscount(notional, purchaseProceeds);
    const purchaseDate = computeWeightedAveragePurchaseDate(
        allFixedIncomeTransactions,
    );

    return {
        notional,
        purchaseProceeds,
        salesProceeds,
        purchasePrice,
        totalDiscount,
        purchaseDate,
        realizedSurplus,
    };
}

export function computeWeightedAveragePurchaseDate(
    transactions: BaseTransaction[],
) {
    if (!transactions.length) return new Date().toISOString();
    let sumWeightedTime = 0;
    let sumAmount = 0;

    transactions.forEach(({ entryTime, amount }) => {
        const time = new Date(entryTime).getTime(); // Convert to milliseconds since the epoch
        sumWeightedTime += time * amount; // Weight by the amount
        sumAmount += amount;
    });

    if (sumAmount === 0) throw new Error('Sum of amount cannot be zero.');

    const averageTimeInMs = sumWeightedTime / sumAmount; // Calculate the weighted average in milliseconds
    const averageDate = new Date(averageTimeInMs); // Convert back to a Date object

    // Round to the nearest day
    return roundToNearestDay(averageDate).toISOString();
}

export function calculateNotional(
    assetPurchaseFixedIncomeTransactions: BaseTransaction[],
    assetSaleFixedIncomeTransactions: BaseTransaction[],
) {
    const sumOfAssetPurchaseFixedIncomeTransactions =
        assetPurchaseFixedIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0,
        );

    const sumOfAssetSaleFixedIncomeTransactions =
        assetSaleFixedIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0,
        );

    return (
        sumOfAssetPurchaseFixedIncomeTransactions -
        sumOfAssetSaleFixedIncomeTransactions
    );
}

export function calculatePurchaseProceeds(
    assetPurchaseBaseTransactions: BaseTransaction[],
    allGroupTransactions: GroupTransaction[],
) {
    const totalSpentOnPurchases = sumBaseTransactionAmounts(
        assetPurchaseBaseTransactions,
    );
    const totalFees = sumGroupTransactionFees(allGroupTransactions);

    return totalSpentOnPurchases + totalFees;
}

export function calculateSalesProceeds(
    assetSaleFixedIncomeTransactions: BaseTransaction[],
) {
    // total proceeds from sales
    return sumBaseTransactionAmounts(assetSaleFixedIncomeTransactions);
}

export function calculateRealizedSurplus(
    salesProceeds: number,
    purchaseProceeds: number,
) {
    // todo: when interest payment transactions are implemented, change to
    // salesProceeds + interestPayments - purchaseProceeds
    return salesProceeds - purchaseProceeds;
}

export function sumGroupTransactionFees(transactions: GroupTransaction[]) {
    return transactions.reduce((sum, { fees }) => {
        if (!fees) return sum;
        return sum + fees.reduce((feeSum, { amount }) => feeSum + amount, 0);
    }, 0);
}

export function sumBaseTransactionAmounts(transactions: BaseTransaction[]) {
    return transactions.reduce((sum, { amount }) => sum + amount, 0);
}

export function calculatePurchasePrice(
    purchaseProceeds: number,
    notional: number,
) {
    if (notional === 0) return 0;
    return purchaseProceeds / notional;
}

export function calculateTotalDiscount(
    notional: number,
    purchaseProceeds: number,
) {
    return notional - purchaseProceeds;
}
