import { GroupTransaction, GroupTransactionType } from '../..';
import { ASSET_PURCHASE, ASSET_SALE, PRINCIPAL_RETURN } from '../constants';

/**
 * Compute derived fields for fixed income assets
 *
 * @param transactions - All group transactions for given asset
 */
export function computeFixedIncomeAssetDerivedFields(
    transactions: GroupTransaction[],
) {
    const purchaseDate = calculatePurchaseDate(transactions);
    const notional = calculateNotional(transactions);
    const assetProceeds = calculateAssetProceeds(transactions);
    const purchaseProceeds = calculatePurchaseProceeds(transactions);
    const salesProceeds = calculateSalesProceeds(transactions);
    const purchasePrice = calculatePurchasePrice(transactions);
    const totalDiscount = calculateTotalDiscount(transactions);
    const realizedSurplus = calculateRealizedSurplus(transactions);

    return {
        purchaseDate,
        notional,
        assetProceeds,
        purchaseProceeds,
        salesProceeds,
        purchasePrice,
        totalDiscount,
        realizedSurplus,
    };
}

/**
 * Purchase date
 *
 * Weighted average of fixed income transaction amounts for a given asset
 * Weighted Average Purchase Date = (SUM( Quantity * Date )) / SUM( Quantity)
 * Where Quantity is the amount of each fixed income transaction
 */
export function calculatePurchaseDate(transactions: GroupTransaction[]) {
    if (!transactions.length) return '';

    const sumQuantity = sumBaseTransactionAmounts(
        transactions,
        'cashTransaction',
    );

    // In the special case where the most recent transaction brings the sum quantity to zero,
    // we perform the calculation excluding the most recent transaction
    const transactionsToUse =
        sumQuantity === 0 ? transactions.slice(0, -1) : transactions;

    const sumQuantityTimesDate = transactionsToUse.reduce(
        (sum, { cashTransaction }) => {
            if (!cashTransaction) return sum;
            const { entryTime, amount } = cashTransaction;
            // Convert to milliseconds since the epoch
            const time = new Date(entryTime).getTime();
            return sum + time * amount;
        },
        0,
    );

    // Calculate the weighted average in milliseconds
    const purchaseDateMs = sumQuantityTimesDate / sumQuantity;
    // Convert back to a Date object
    const purchaseDate = new Date(purchaseDateMs);
    // Round to the nearest day
    return roundToNearestDay(purchaseDate).toISOString();
}

/**
 * Notional
 *
 * Face value sum of cash transactions for a given asset
 * Notional = SUM(Asset Proceeds)
 * Where Asset Proceeds is the amount of each cash transaction
 */
export function calculateNotional(transactions: GroupTransaction[]) {
    return sumBaseTransactionAmounts(transactions, 'cashTransaction');
}

/**
 * Asset proceeds
 * Cost to acquire or dispose of an asset _without_ fees
 *
 * Asset Proceeds = SUM(Cost to acquire or dispose of an asset without fees)
 */
export function calculateAssetProceeds(transactions: GroupTransaction[]) {
    return sumBaseTransactionAmounts(transactions, 'cashTransaction');
}

/**
 * Purchase proceeds
 *
 * Cost to acquire asset _with_ fees
 * Purchase Proceeds = SUM(Cash Balance Change of Purchase Txs)
 */
export function calculatePurchaseProceeds(transactions: GroupTransaction[]) {
    const purchaseTransactions = transactions.filter(
        ({ type }) => type === ASSET_PURCHASE,
    );
    const sumCashBalanceChange = sumBaseTransactionAmounts(
        purchaseTransactions,
        'cashTransaction',
    );

    return sumCashBalanceChange;
}

/**
 * Sales proceeds
 *
 * Amount received for the disposal of asset with fees
 * Sale Proceeds = SUM(Cash Balance Change of Sale Txs)
 */
export function calculateSalesProceeds(transactions: GroupTransaction[]) {
    const saleTransactions = transactions.filter(
        ({ type }) => type === ASSET_SALE,
    );
    const sumCashBalanceChange = sumBaseTransactionAmounts(
        saleTransactions,
        'cashTransaction',
    );

    return sumCashBalanceChange;
}

/**
 * Purchase price
 *
 * Total spent per unit including fees
 *
 * Purchase price = Purchase proceeds / Quantity
 */
export function calculatePurchasePrice(transactions: GroupTransaction[]) {
    const quantity = sumBaseTransactionAmounts(
        transactions,
        'fixedIncomeTransaction',
    );
    // avoid divide by zero
    if (quantity === 0) return 0;

    const purchaseProceeds = calculatePurchaseProceeds(transactions);

    return purchaseProceeds / quantity;
}

/**
 * Total discount
 *
 * Notional minus purchase proceeds
 * Total discount = Notional - SUM(Purchase proceeds - Sale Proceeds)
 */
export function calculateTotalDiscount(transactions: GroupTransaction[]) {
    const notional = calculateNotional(transactions);
    const purchaseProceeds = calculatePurchaseProceeds(transactions);
    const salesProceeds = calculateSalesProceeds(transactions);

    return notional - (purchaseProceeds - salesProceeds);
}

/**
 * Realized surplus
 *
 * Excess of total assets over total liabilities that have been confirmed through the actual sale or disposal of assets.
 *
 * Realized Surplus = only give value if >0 -> Sale Proceeds - Purchase Proceeds
 */
export function calculateRealizedSurplus(transactions: GroupTransaction[]) {
    const salesProceeds = calculateSalesProceeds(transactions);
    const purchaseProceeds = calculatePurchaseProceeds(transactions);

    const realizedSurplus = salesProceeds - purchaseProceeds;

    return realizedSurplus > 0 ? realizedSurplus : 0;
}

/**
 * Helper function to sum fees for a given group transaction
 */
export function sumGroupTransactionFees(transactions: GroupTransaction[]) {
    return transactions.reduce((sum, { fees }) => {
        if (!fees) return sum;
        return sum + fees.reduce((feeSum, { amount }) => feeSum + amount, 0);
    }, 0);
}

/**
 * Helper function to sum amounts for either cash or fixed income transactions for a given asset
 */
export function sumBaseTransactionAmounts(
    transactions: GroupTransaction[],
    cashOrFixedIncomeTransaction: 'cashTransaction' | 'fixedIncomeTransaction',
) {
    return transactions.reduce((sum, transaction) => {
        const baseTransaction = transaction[cashOrFixedIncomeTransaction];
        if (!baseTransaction) return sum;
        const { type } = transaction;
        const { amount } = baseTransaction;
        const sign = getTransactionAmountSign(type);
        return sum + sign * amount;
    }, 0);
}

export function getTransactionAmountSign(
    transactionType: GroupTransactionType,
) {
    const sign =
        transactionType === ASSET_SALE || transactionType === PRINCIPAL_RETURN
            ? 1
            : -1;

    return sign;
}

/**
 * Round a date to the nearest day
 */
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
