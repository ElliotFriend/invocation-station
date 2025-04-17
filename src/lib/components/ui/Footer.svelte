<script lang="ts">
    import { SlideToggle } from "@skeletonlabs/skeleton";
    import { network } from "$lib/NetworkSwitcher.svelte";

    function toggleNetwork(event: Event) {
        network.switchNetwork((event.target as HTMLInputElement).checked)
    }
</script>

<footer class="bg-surface-100-800-token shadow-xl p-4">
    <div class="flex justify-center items-center">
        <code class="code">TESTNET</code>
        <SlideToggle name="mainnet-testnet-toggle" class="mx-4" checked={network.usingMainnet} onchange={toggleNetwork} active="bg-primary-500" />
        <code class="code">MAINNET</code>
    </div>
</footer>
