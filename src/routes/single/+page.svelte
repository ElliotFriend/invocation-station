<script lang="ts">
    import { xdr, contract, Keypair, } from '@stellar/stellar-sdk'
    import { createContractClient } from '$lib/stellar';
    import FunctionParam from '$lib/components/FunctionParam.svelte';
    import { network } from '$lib/NetworkSwitcher.svelte';

    let knownContracts = $state({
        mainnet: [
            'CBMGLZ2ZDEJFXIUEO4L3VQO5OKS4CLY3VCYXRZAGFNEIDFIDPWZV23VB', // trading post
            'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA', // KALE homestead
        ],
        testnet: [
            'CCI4W2X36Y54TRFSBB23QJYTYZS6JPAWKGV2N4S7XTNMJKSQ27ZYXPF3', // hello world
            'CBFATL6RYVWBUKYOM7CCDRUJVYLTB3SWGZSSN2L3CHK2QAKEKG7VWNGE', // custom types
            'CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ', // other custom types
            'CCHZKMVGSP3N4YEHD4EFHA6UKND5NDVP4COTAFENAFMPRNTEC2U2ST5F', // BLEND pool
        ]
    })

    let contractAddress = $state('CBHQGTSBJWA54K67RSG3JPXSZY5IXIZ4FSLJM4PQ33FA3FYCU5YZV7MZ')
    let publicKey = $state('GA4XQJFTIVONNM2MXU5ICJU2HSRVNK6O45EJO7SJF43OXW4TDWQOQZ4W')
    let selectedFunction = $state('')
    let funcArgs: Record<string, any> = $state({})
    let client: contract.Client|undefined = $state()


    let kp = $derived(Keypair.fromPublicKey(publicKey));
    let spec = $derived(client?.spec)
    let funcs = $derived(spec?.funcs())
    let funcSchema = $derived(selectedFunction ? spec?.getFunc(selectedFunction.toString()) : undefined)
    let selectedFunc = $derived({
        name: funcSchema?.name().toString(),
        doc: funcSchema?.doc().toString(),
        args: funcSchema?.inputs(),
    })

    async function loadContract() {
        client = await createContractClient(contractAddress, kp.publicKey())
        selectContractFunction('')
    }

    function selectContractFunction(funcName: string) {
        selectedFunction = funcName
        funcArgs = {}
    }

    async function invokeContract() {
        const method = selectedFunction.toString()

        let atMaybe = await contract.AssembledTransaction.build({
            method: method,
            args: client?.spec.funcArgsToScVals(method, funcArgs),
            ...client!.options,
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
</script>

<h1 class="h1">Invoke a single contract</h1>

<h2 class="h2">Load Contract</h2>

<form class="space-y-4">
    <label class="label">
        <span>Contract Address</span>
        <select class="select" placeholder="C..." bind:value={contractAddress}>
            {#each knownContracts[network.usingMainnet ? 'mainnet' : 'testnet'] as contract}
                <option>{contract}</option>
            {/each}
        </select>
    </label>

    <label class="label">
        <span>Source Account Public Key</span>
        <input class="input font-mono" type="text" placeholder="G..." bind:value={publicKey} />
    </label>

    <button class="btn variant-filled-primary" onclick={loadContract}>Load Contract</button>
</form>

{#if client && funcs}
    <h2 class="h2">Contract Details</h2>

    <h3 class="h3">Address</h3>
    <p><code class="code">{contractAddress}</code></p>

    <h3 class="h3">Wasm Hash</h3>
    <p><code class="code">deadb33f...</code></p>

    <h3 class="h3">Functions</h3>
    <select class="select" bind:value={() => selectedFunction, selectContractFunction}>
        {#each funcs as func}
            <option>{func.name()}</option>
        {/each}
    </select>

    {#if client && selectedFunction}
        {#if selectedFunc.doc}
            <h3 class="h3">Description</h3>
            <pre class="pre">{selectedFunc.doc}</pre>
        {/if}

        <h3 class="h3">Arguments</h3>
        <div class="space-y-4">
            {#if selectedFunc.args?.length}
                {#each selectedFunc.args as arg (arg.name().toString())}
                    <FunctionParam {arg} bind:value={funcArgs[arg.name().toString()]} />
                {/each}

                <pre class="pre">{JSON.stringify(funcArgs, null, 2)}</pre>
            {:else}
                <p>None required</p>
            {/if}

            <button class="btn variant-filled-primary" onclick={invokeContract}>Invoke Contract</button>
        </div>
    {/if}
{/if}
