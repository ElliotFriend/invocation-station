import { PUBLIC_STELLAR_NETWORK_PASSPHRASE, PUBLIC_STELLAR_RPC_URL } from '$env/static/public'
import { StrKey, contract } from '@stellar/stellar-sdk'
import { Server } from '@stellar/stellar-sdk/rpc'
import { Client } from '@stellar/stellar-sdk/contract'

export const rpc = new Server(PUBLIC_STELLAR_RPC_URL)

export async function createContractClient(address: string): Promise<Client|undefined> {
    if (StrKey.isValidContract(address)) {
        const contractClient = await contract.Client.from({
            rpcUrl: PUBLIC_STELLAR_RPC_URL,
            networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
            contractId: address,
        })
        return contractClient
    }
}
