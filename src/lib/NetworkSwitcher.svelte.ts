import { Networks } from "@stellar/stellar-sdk";

class StellarNetwork {
    horizonUrl = $state('');
    rpcUrl = $state('');
    networkPassphrase = $state('');
    usingMainnet = $state(false)

    constructor() {
        this.switchNetwork(this.usingMainnet)
    }

    switchNetwork(mainnet: boolean = false) {
        if (mainnet) {
            this.useMainnet();
        } else {
            this.useTestnet();
        }
    }

    useTestnet() {
        this.horizonUrl = 'https://horizon-testnet.stellar.org';
        this.rpcUrl = 'https://soroban-testnet.stellar.org';
        this.networkPassphrase = Networks.TESTNET;
        this.usingMainnet = false
    }

    useMainnet() {
        this.horizonUrl = 'https://horizon.stellar.org';
        this.rpcUrl = 'https://mainnet.sorobanrpc.com';
        this.networkPassphrase = Networks.PUBLIC;
        this.usingMainnet = true
    }
}

export const network = new StellarNetwork()
