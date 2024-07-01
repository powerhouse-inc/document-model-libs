import { randomInt } from 'crypto';
import {
    Action,
    ActionSigner,
    BaseAction,
    Operation,
    Reducer,
    utils as docUtils,
} from 'document-model/document';
import { readFileSync } from 'node:fs';
import { readdir, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { RealWorldAssetsAction, reducer, utils } from '..';
import { signOperation } from './signOperation';

function getRandomTime() {
    const hours = randomInt(0, 24);
    const minutes = randomInt(0, 60);
    const seconds = randomInt(0, 60);
    return { hours, minutes, seconds };
}

function generateDatesArray(length: number) {
    const dates: Date[] = [];
    let currentDate = new Date();
    currentDate.setMonth(0);

    while (dates.length < length) {
        const streakLength = randomInt(3, 11); // random length between 3 and 10
        for (let i = 0; i < streakLength && dates.length < length; i++) {
            const { hours, minutes, seconds } = getRandomTime();
            const newDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate(),
                hours,
                minutes,
                seconds,
            );
            dates.push(newDate);
        }
        currentDate.setDate(currentDate.getDate() + 1); // move to the next day
    }

    return dates.map(date => date.toISOString());
}

function updateOperations(
    operations: {
        global: Record<string, any>[];
        local: Record<string, any>[];
    },
    scope: 'global' | 'local',
    fieldsToChange?: Record<string, any>,
    fieldsToRemove?: string[],
) {
    for (const operation of operations[scope]) {
        if (fieldsToChange) {
            for (const [key, value] of Object.entries(fieldsToChange)) {
                const _value =
                    typeof value === 'function' ? value(operation) : value;
                operation[key] = _value;
            }
        }

        if (fieldsToRemove) {
            for (const field of fieldsToRemove) {
                delete operation[field];
            }
        }
    }
}

const srcDir = 'documents';
const targetDir = 'documents-updated';

const documentDirNames = await readdir(srcDir);

const signer: ActionSigner = {
    user: {
        address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        chainId: 1,
        networkId: 'eip155',
    },
    app: {
        name: 'Connect',
        key: 'did:key:zDnaeoh4qqux79ds9EHbC5tmJfpEi5xh9opycpgz98dsAYYSB',
    },
    signatures: [],
};

for (const name of documentDirNames) {
    let document = utils.createDocument();
    const documentId = docUtils.hashKey();
    const path = join(srcDir, name, 'operations.json');
    const file = readFileSync(path);
    const operations = JSON.parse(file.toString()) as {
        global: Record<string, any>[];
        local: Record<string, any>[];
    };
    const fieldsToChange = {
        id: () => docUtils.hashKey(),
        context: {
            signer,
        },
    };
    const fieldsToRemove = ['resultingState'];
    const timestamps = generateDatesArray(operations.global.length);

    updateOperations(operations, 'global', fieldsToChange, fieldsToRemove);

    for (const operation of operations.global) {
        document = reducer(document, operation as RealWorldAssetsAction);
    }

    for (let i = 0; i <= document.operations.global.length - 1; i++) {
        const operation = document.operations.global[i];
        const signedOperation = await signOperation({
            operation,
            documentId,
            document,
            reducer: reducer as Reducer<unknown, Action, unknown>,
        });
        signedOperation.timestamp = timestamps[i];

        document.operations.global[i] = signedOperation as Operation<
            RealWorldAssetsAction | BaseAction
        >;
    }
    await utils.saveToFile(document, targetDir, `${name}-updated`);
}

const updatedDocumentFileNames = await readdir(targetDir);

for (const name of updatedDocumentFileNames) {
    const path = join(targetDir, name);
    const fixedName = name.replace('..zip', '.zip');
    const fixedNamePath = join(targetDir, fixedName);
    await rename(path, fixedNamePath);
}
