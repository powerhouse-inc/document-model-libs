/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { RwaPortfolioTransactionsOperations } from '../../gen/transactions/operations';

function setToMiddayUTC(input: string) {
    // Check if the input is a string and contains a time component
    const hasTime = input.includes('T') || input.includes(' ');

    // Create a Date object from the input
    let date = new Date(input);

    // If the input doesn't have a time component, set to 12:00 UTC
    if (!hasTime) {
        date = new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                12,
                0,
                0,
            ),
        );
    }

    return date;
}

export const reducer: RwaPortfolioTransactionsOperations = {
    addBaseTransactionOperation(state, action, dispatch) {
        if (
            !action.input.id ||
            !action.input.asset ||
            !action.input.amount ||
            !action.input.entryTime
        ) {
            throw new Error('Id, asset, amount, and entryTime are required');
        }

        if (!state.portfolio.find(asset => asset.id === action.input.asset)) {
            throw new Error(`Asset ${action.input.asset} not found`);
        }

        if (isNaN(Number(action.input.amount))) {
            throw new Error(`Invalid amount: ${action.input.amount}`);
        }

        if (isNaN(new Date(action.input.entryTime).getTime())) {
            throw new Error(`Invalid entry time: ${action.input.entryTime}`);
        }

        if (
            !!action.input.tradeTime &&
            isNaN(new Date(action.input.tradeTime).getTime())
        ) {
            throw new Error(`Invalid trade time: ${action.input.tradeTime}`);
        }

        if (
            !!action.input.settlementTime &&
            isNaN(new Date(action.input.settlementTime).getTime())
        ) {
            throw new Error(
                `Invalid settlement time: ${action.input.settlementTime}`,
            );
        }

        if (
            action.input.account &&
            !state.accounts.find(account => account.id === action.input.account)
        ) {
            throw new Error(`Account ${action.input.account} not found`);
        }

        if (
            action.input.counterParty &&
            !state.accounts.find(
                account => account.id === action.input.counterParty,
            )
        ) {
            throw new Error(`Counter party asset ${action.input.id} not found`);
        }

        // TODO: need `baseTransactions` list in state
    },
    editTransactionOperation(state, action, dispatch) {
        // TODO: needs `baseTransactions` list in state
    },
    deleteTransactionOperation(state, action, dispatch) {
        // TODO: need `baseTransactions` list in state
    },
};
