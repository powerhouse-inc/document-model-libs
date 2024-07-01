import type { JsonWebKeyPairStorage, JwkKeyPair } from '.';

export class InMemoryKeyStorage implements JsonWebKeyPairStorage {
    #keyPair: JwkKeyPair | undefined;

    constructor() {}

    saveKeyPair(keyPair: JwkKeyPair) {
        this.#keyPair = keyPair;

        return Promise.resolve();
    }

    loadKeyPair(): Promise<JwkKeyPair> {
        return Promise.resolve(this.#keyPair!);
    }
}
