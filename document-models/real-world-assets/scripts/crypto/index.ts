import {
    compressedKeyInHexfromRaw,
    encodeDIDfromHexString,
    rawKeyInHexfromUncompressed,
} from 'did-key-creator';
import { subtle } from 'node:crypto';

export type JwkKeyPair = {
    publicKey: JsonWebKey;
    privateKey: JsonWebKey;
};

export interface JsonWebKeyPairStorage {
    loadKeyPair(): Promise<JwkKeyPair | undefined>;
    saveKeyPair(keyPair: JwkKeyPair): Promise<void>;
}

function ab2hex(ab: ArrayBuffer) {
    return Array.prototype.map
        .call(new Uint8Array(ab), (x: number) =>
            ('00' + x.toString(16)).slice(-2),
        )
        .join('');
}

export interface IConnectCrypto {
    did: () => Promise<DID>;
    regenerateDid(): Promise<void>;
}

export type DID = `did:key:${string}`;

export class ConnectCrypto implements IConnectCrypto {
    #keyPair: CryptoKeyPair | undefined;
    #keyPairStorage: JsonWebKeyPairStorage;

    #did: Promise<DID>;

    static algorithm: EcKeyAlgorithm = {
        name: 'ECDSA',
        namedCurve: 'P-256',
    };

    constructor(keyPairStorage: JsonWebKeyPairStorage) {
        this.#keyPairStorage = keyPairStorage;

        // Initializes the subtleCrypto module according to the host environment

        this.#did = this.#initialize();
    }

    // loads the key pair from storage or generates a new one if none is stored
    async #initialize() {
        const loadedKeyPair = await this.#keyPairStorage.loadKeyPair();
        if (loadedKeyPair) {
            this.#keyPair = await this.#importKeyPair(loadedKeyPair);
            console.log('Found key pair');
        } else {
            this.#keyPair = await this.#generateECDSAKeyPair();
            console.log('Created key pair');
            await this.#keyPairStorage.saveKeyPair(await this.#exportKeyPair());
        }
        const did = await this.#parseDid();
        console.log('Connect DID:', did);
        return did;
    }

    did() {
        return this.#did;
    }

    async regenerateDid() {
        this.#keyPair = await this.#generateECDSAKeyPair();
        await this.#keyPairStorage.saveKeyPair(await this.#exportKeyPair());
    }

    async #parseDid(): Promise<DID> {
        if (!this.#keyPair) {
            throw new Error('No key pair available');
        }

        const publicKeyRaw = await subtle.exportKey(
            'raw',
            this.#keyPair.publicKey,
        );

        const multicodecName = 'p256-pub';
        const rawKey = rawKeyInHexfromUncompressed(ab2hex(publicKeyRaw));
        const compressedKey = compressedKeyInHexfromRaw(rawKey);
        const did = encodeDIDfromHexString(multicodecName, compressedKey);
        return did as DID;
    }

    async #generateECDSAKeyPair() {
        const keyPair = await subtle.generateKey(
            ConnectCrypto.algorithm,
            true,
            ['sign', 'verify'],
        );
        return keyPair;
    }

    async #exportKeyPair(): Promise<JwkKeyPair> {
        if (!this.#keyPair) {
            throw new Error('No key pair available');
        }
        const jwkKeyPair = {
            publicKey: await subtle.exportKey('jwk', this.#keyPair.publicKey),
            privateKey: await subtle.exportKey('jwk', this.#keyPair.privateKey),
        };
        return jwkKeyPair;
    }

    async #importKeyPair(jwkKeyPair: JwkKeyPair): Promise<CryptoKeyPair> {
        return {
            publicKey: await subtle.importKey(
                'jwk',
                jwkKeyPair.publicKey,
                ConnectCrypto.algorithm,
                true,
                ['verify'],
            ),
            privateKey: await subtle.importKey(
                'jwk',
                jwkKeyPair.privateKey,
                ConnectCrypto.algorithm,
                true,
                ['sign'],
            ),
        };
    }

    #sign = async (
        ...args: Parameters<SubtleCrypto['sign']>
    ): Promise<ArrayBuffer> => {
        return subtle.sign(...args);
    };

    #verify = async (
        ...args: Parameters<SubtleCrypto['verify']>
    ): Promise<boolean> => {
        return subtle.verify(...args);
    };
}
