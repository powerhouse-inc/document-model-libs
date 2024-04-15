export const signer = '0x50379DDB64b77e990Bc4A433c9337618C70D2C2a';

export const createContext = (addr: string = signer) => ({
    signer: {
        user: {
            address: addr,
            chainId: 1,
            networkId: '',
        },
        app: {
            key: '',
            name: '',
        },
        signature: '',
    },
});
