import { LineItemForecast } from '@acaldas/document-model-graphql/budget-statement';
import JSZip from 'jszip';
import type { FileInput } from '../../document/utils';
import {
    createDocument,
    createZip,
    loadFromFile,
    loadFromInput,
    saveToFile,
} from '../../document/utils';
import { readFile } from '../../document/utils/node';
import { reducer } from './reducer';
import {
    Account,
    AccountInput,
    BudgetStatementAction,
    BudgetStatementDocument,
    LineItem,
    LineItemInput,
    State,
} from './types';

/**
 *
 * Creates a new BudgetStatement document with an initial state.
 * @param initialState - The initial state of the document.
 * @returns The new BudgetStatement document.
 */
export const createBudgetStatement = (
    initialState?: Partial<
        Omit<BudgetStatementDocument, 'data'> & {
            data: Partial<BudgetStatementDocument['data']>;
        }
    >
): BudgetStatementDocument =>
    createDocument<State, BudgetStatementAction>({
        documentType: 'powerhouse/budget-statement',
        ...initialState,
        data: {
            owner: {
                ref: null,
                id: null,
                title: null,
            },
            month: null,
            quoteCurrency: null,
            vesting: [],
            ftes: null,
            accounts: [],
            auditReports: [],
            comments: [],
            ...initialState?.data,
        },
    });

/**
 * Creates a new Account with default properties and the given input properties.
 * @param input - The input properties of the account.
 * @returns The new Account object.
 */
export const createAccount = (input: AccountInput): Account => ({
    ...input,
    name: input.name ?? '',
    lineItems: input.lineItems?.map(createLineItem) ?? new Array<LineItem>(),
});

/**
 * Creates a new LineItem with default properties and the given input properties.
 * @param input - The input properties of the line item.
 * @returns The new LineItem object.
 */
export const createLineItem = (input: LineItemInput): LineItem => ({
    budgetCap: null,
    payment: null,
    actual: null,
    comment: null,
    ...input,
    forecast:
        input.forecast?.sort((f1, f2) => f1.month.localeCompare(f2.month)) ??
        new Array<LineItemForecast>(),
    headcountExpense: input.headcountExpense ?? false,
    group: input.group ?? null,
    category: input.category ?? null,
});

/**
 * Saves the BudgetStatement document to the specified file path.
 * @param document - The BudgetStatement document to save.
 * @param path - The file path to save the document to.
 * @returns  A promise that resolves with the saved file path.
 */
export const saveBudgetStatementToFile = (
    document: BudgetStatementDocument,
    path: string,
    name?: string
): Promise<string> => {
    return saveToFile(document, path, 'phbs', name);
};

/**
 * Loads the BudgetStatement document from the specified file path.
 * @param path - The file path to load the document from.
 * @returns A promise that resolves with the loaded BudgetStatement document.
 */
export const loadBudgetStatementFromFile = async (
    path: string
): Promise<BudgetStatementDocument> => {
    const state = await loadFromFile<State, BudgetStatementAction>(
        path,
        reducer
    );

    const auditReports = state.data.auditReports;
    if (!auditReports.length) {
        return state;
    }

    const file = readFile(path);
    const zip = new JSZip();
    await zip.loadAsync(file);
    const fileRegistry = { ...state.fileRegistry };
    await Promise.all(
        auditReports.map(async audit => {
            const path = audit.report.slice('attachment://'.length);
            const file = await zip.file(path);
            if (!file) {
                throw new Error(`Attachment ${audit.report} not found`);
            }
            const data = await file.async('base64');
            const { mimeType, extension, fileName } = JSON.parse(file.comment);
            fileRegistry[audit.report] = {
                data,
                mimeType,
                extension,
                fileName,
            };
        })
    );
    return { ...state, fileRegistry };
};

export const loadBudgetStatementFromInput = async (
    input: FileInput
): Promise<BudgetStatementDocument> => {
    const state = await loadFromInput<State, BudgetStatementAction>(
        input,
        reducer
    );

    const auditReports = state.data.auditReports;
    if (!auditReports.length) {
        return state;
    }

    const zip = new JSZip();
    await zip.loadAsync(input);
    const fileRegistry = { ...state.fileRegistry };
    await Promise.all(
        auditReports.map(async audit => {
            const path = audit.report.slice('attachment://'.length);
            const file = await zip.file(path);
            if (!file) {
                throw new Error(`Attachment ${audit.report} not found`);
            }
            const data = await file.async('base64');
            const { mimeType, extension, fileName } = JSON.parse(file.comment);
            fileRegistry[audit.report] = {
                data,
                mimeType,
                extension,
                fileName,
            };
        })
    );
    return { ...state, fileRegistry };
};

export const saveBudgetStatementToFileHandle = async (
    document: BudgetStatementDocument,
    input: FileSystemFileHandle
) => {
    const zip = await createZip(document);
    const blob = await zip.generateAsync({ type: 'blob' });
    const writable = await input.createWritable();
    await writable.write(blob);
    await writable.close();
};
