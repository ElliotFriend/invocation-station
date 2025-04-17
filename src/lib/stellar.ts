import { StrKey, contract } from '@stellar/stellar-sdk'
import { Server } from '@stellar/stellar-sdk/rpc'
import { Client } from '@stellar/stellar-sdk/contract'
import { network } from '$lib/NetworkSwitcher.svelte'

export const rpc = new Server(network.rpcUrl)

export async function createContractClient(address: string, sourceAccount?: string): Promise<Client|undefined> {
    if (StrKey.isValidContract(address)) {
        const contractClient = await contract.Client.from({
            rpcUrl: network.rpcUrl,
            networkPassphrase: network.networkPassphrase,
            contractId: address,
            publicKey: sourceAccount || undefined,
        })
        return contractClient
    }
}
