<script lang="ts">
    import type { PageData } from './$types';
    import { Buffer } from 'buffer';
    // import { Client } from '@stellar/stellar-sdk/contract'
    import { StrKey, Contract, xdr, contract, Keypair, TransactionBuilder, Networks, BASE_FEE } from '@stellar/stellar-sdk'
    import { rpc, createContractClient } from '$lib/stellar';
    import { PUBLIC_STELLAR_NETWORK_PASSPHRASE, PUBLIC_STELLAR_RPC_URL } from '$env/static/public';
    import RefParser from '@apidevtools/json-schema-ref-parser';

    const INPUT_TYPES: Record<number, string> = {
        4: 'number',
        16: 'text',
    }

    // GAEYC3IWGG2HLMW2JDHJR3PM5KVOB3MH2FIMWBNED36AY6XAAPB6OGVE
    const kp = Keypair.fromSecret('SCM2H3FJUMYZOPUDILVYDJAXX3B3SQPL62RWGTR35A6RO3R4C7IL4PAE')

    let { data }: { data: PageData } = $props();
    // use the guestbook contract for now
    let contractAddress = $state('CCEMPEEL2NFCCSN2WKSX5AWQSIZLIX4YI2ZLVZGELH7MGRNECQXSIYSH')
    let client: contract.Client|undefined = $state()
    let spec = $derived(client?.spec)
    let funcs = $derived(spec?.funcs())
    let selectedFunction = $state('')
    let contractSchema = $derived(client?.spec.jsonSchema())
    let funcSchema = $state()
    let funcArgs: Record<string, any> = $state({})
    // let funcSchema = $derived.by(async () => await RefParser.dereference(client?.spec.jsonSchema(selectedFunction.toString())))
    // let funcSchema
    // $inspect('new schema', funcSchema)
    // $inspect(funcArgs)
    // $effect(() => {
    //     console.log('funcArgs', funcArgs)
    // })

    async function loadContract() {
        client = await createContractClient(contractAddress)
        console.log('client', client)
        await RefParser.dereference(contractSchema)
        console.log('contract schema', contractSchema)
        console.log('own props?', Object.getOwnPropertyNames(client))
        // console.log('function thing?', client['edit_message'])
    }

    async function invokeContract() {
        const method = selectedFunction.toString()
        const account = await rpc.getAccount(kp.publicKey())
        const invokingContract = new Contract(contractAddress)

        let atMaybe = await contract.AssembledTransaction.build({
            method: method,
            args: client?.spec.funcArgsToScVals(method, funcArgs),
            contractId: contractAddress,
            publicKey: kp.publicKey(),
            networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
            rpcUrl: PUBLIC_STELLAR_RPC_URL,
            parseResultXdr: (result: xdr.ScVal) => spec?.funcResToNative(method, result)
        })
        console.log('atMaybe?', atMaybe)
        console.log('read only?', atMaybe.isReadCall)
        console.log('result?', atMaybe.result)

        // let transaction = new TransactionBuilder(
        //     account, {
        //         networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE,
        //         fee: BASE_FEE,
        //     })
        //     .addOperation(invokingContract.call(
        //         selectedFunction,
        //     ))
        // client?.txFromJSON(JSON.stringify({

        // }))
    }

    // function parseFuncSchema() {
    //     funcSchema = contractSchema?.definitions?.[selectedFunction.toString()]
    //     console.log('func schema', funcSchema)
    // }
</script>

<h1 class="h1">Invoke a single contract</h1>

<h2 class="h2">Load contract</h2>

<form class="space-y-4">
    <label class="label">
        <span>Contract address</span>
        <input class="input" type="text" placeholder="C..." bind:value={contractAddress} />
    </label>

    <button class="btn variant-filled-primary" onclick={loadContract}>Load Contract</button>
</form>

{#if client && funcs}
    <h2 class="h2">Contract details</h2>

    <h3 class="h3">Address</h3>
    <p>{contractAddress}</p>

    <h3 class="h3">Functions</h3>
    <select class="select" bind:value={selectedFunction}>
        {#each funcs as func}
            <option>{func.name()}</option>
        {/each}
    </select>

    {#if client && selectedFunction}
        <h3 class="h3">Arguments</h3>
        <form class="space-y-4">
            {#each client.spec.getFunc(selectedFunction.toString()).inputs() as arg}
                {@const argName = arg.name().toString()}
                {@const argType = INPUT_TYPES[arg.type().switch().value]}
                <label class="label">
                    <span>{argName}</span>
                    <input class="input" type={argType} bind:value={funcArgs[argName]} />
                </label>
            {/each}

            <button class="btn variant-filled-primary" onclick={invokeContract}>Invoke Contract</button>
        </form>
    {/if}
{/if}
