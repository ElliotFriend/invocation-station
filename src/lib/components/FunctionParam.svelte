<script lang="ts">
    import { xdr } from '@stellar/stellar-sdk'
    import { SlideToggle } from '@skeletonlabs/skeleton';
    import { toSentenceCase, toTitleCase } from '$lib/utils';

    const INPUT_TYPES: Record<number, string> = {
        1: 'checkbox', // : bool
        4: 'number', // : u32
        5: 'number', // : i32
        6: 'number', // : u64
        7: 'number', // : i64
        10: 'number', // : u128
        11: 'number', // : i128
        12: 'number', // : u256
        13: 'number', // : i256
        14: 'text', // : bytes
        16: 'text', // : string
        17: 'text', // : symbol
        19: 'text', // : address
        1000: 'text', // : option
        1002: 'textarea', // : vec
        1004: 'textarea', // : map
        1005: 'text', // : tuple
        1006: 'text', // : bytesn
        2000: 'textarea', // : user-defined - good luck!
    }

    let { arg, value = $bindable() }: { arg: xdr.ScSpecFunctionInputV0; value: any } = $props();

    let argName = $derived(arg.name().toString().replaceAll('_', ' ').trim())
    let argType = $derived(arg.type().switch().value)
    let argTypeName = $derived(arg.type().switch().name.replace('scSpecType', ''))
    let isOption = $derived(argType === 1000)
    let optArg = $derived(isOption ? arg.type().value() as xdr.ScSpecTypeOption : undefined)
    let optArgType = $derived(optArg?.valueType().switch().value)
    let optArgTypeName = $derived(optArg?.valueType().switch().name.replace('scSpecType', ''))
    let inputType = $derived(optArgType ?? argType)

    // a couple derived states for bytesN, Vec types
    let bytesNLength = $derived.by(() => {
        if (optArgType === 1006) {
            return (optArg!.valueType().value() as xdr.ScSpecTypeBytesN).n()
        } else if (argType === 1006) {
            return (arg.type().value() as xdr.ScSpecTypeBytesN).n()
        }
    })
    let vecType = $derived.by(() => {
        if (optArgType === 1002) {
            return (optArg!.valueType().value() as xdr.ScSpecTypeVec).elementType().switch().name.replace('scSpecType', '')
        } else if (argType === 1002) {
            return (arg.type().value() as xdr.ScSpecTypeVec).elementType().switch().name.replace('scSpecType', '')
        }
    })
    let tupleTypes = $derived.by(() => {
        if (argType === 1005) {
            return (arg.type().value() as xdr.ScSpecTypeTuple).valueTypes().map(t => t.switch().value)
        }
    })
    let tupleNames = $derived.by(() => {
        if (argType === 1005) {
            return (arg.type().value() as xdr.ScSpecTypeTuple).valueTypes().map(t => t.switch().name.replace('scSpecType', ''))
        }
    })
    let completeTypeName = $derived.by(() => {
        let name = optArgTypeName ?? argTypeName

        if (bytesNLength) {
            name += `<${bytesNLength}>`
        } else if (vecType) {
            name += `<${vecType}>`
        } else if (tupleNames) {
            name += `(${tupleNames.join(', ')})`
        }
        return isOption ? `Option<${name}>` : name
    })

    // $inspect(argName, tupleTypes, arg.toXDR('base64'))

    function displayVector() {
        return value ? (value as string[]).join('\n') : ''
    }

    function updateVector(newValue: string) {
        value = newValue ? newValue.split('\n') : []
    }

    function displayTuple(i: number) {
        return value ? value[i] : ''
    }

    function updateTuple(newValue: any, i: number) {
        if (value) {
            value[i] = newValue
        } else {
            value = new Array(tupleTypes?.length)
            value[i] = newValue
        }
    }
</script>

{#if inputType === 1}
    <div>
        <SlideToggle active="bg-primary-500" name={arg.name().toString()} checked={value} required={!isOption}>
            {toTitleCase(argName)} <code class="code">{completeTypeName}</code>
        </SlideToggle>
    </div>
{:else}
    <label class="label">
        <span>{toTitleCase(argName)} <code class="code">{completeTypeName}</code></span>
        {#if inputType === 1002}
            <textarea class="textarea" rows="4" placeholder="One vector item per line..." bind:value={displayVector, updateVector} required={!isOption}></textarea>
        {:else if inputType === 1005 && tupleTypes}
            {#each tupleTypes as tType, i}
                <input class="input" type={INPUT_TYPES[tType]} bind:value={() => displayTuple(i), (v) => updateTuple(v, i)} />
            {/each}
        {:else if inputType === 1006 && bytesNLength}
            <input class="input font-mono" type="text" placeholder="Paste as hex-encoded string" bind:value={value} required={!isOption} minlength={bytesNLength * 2} maxlength={bytesNLength * 2} />
        {:else}
            <input class="input" type={INPUT_TYPES[inputType]} bind:value={value} required={!isOption} />
        {/if}
    </label>
{/if}
