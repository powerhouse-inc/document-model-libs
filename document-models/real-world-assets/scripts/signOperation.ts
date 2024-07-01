import {
    Action,
    Document,
    Operation,
    OperationSignatureContext,
    Reducer,
    utils,
} from 'document-model/document';
import { ConnectCrypto } from './crypto';
import { InMemoryKeyStorage } from './crypto/in-memory-storage';

const connectCrypto = (async () => {
    const connectCrypto = new ConnectCrypto(new InMemoryKeyStorage());
    await connectCrypto.did();
    return connectCrypto;
})();

export async function signOperation(params: {
    operation: Operation;
    documentId: string;
    document: Document<unknown, Action>;
    reducer: Reducer<unknown, Action, unknown>;
}) {
    const { operation, documentId, document, reducer } = params;
    const signer = operation.context?.signer;

    if (!signer) {
        throw new Error('Operation must have a signer');
    }

    const context: Omit<
        OperationSignatureContext,
        'operation' | 'previousStateHash'
    > = {
        documentId,
        signer,
    };

    const signedOperation = await utils.buildSignedOperation(
        operation,
        reducer,
        document,
        context,
        async (data: Uint8Array) => {
            const crypto = await connectCrypto;
            return await crypto.sign(data);
        },
    );

    return signedOperation;
}
