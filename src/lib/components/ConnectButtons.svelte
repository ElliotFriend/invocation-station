<!--
 @component
 This component holds the buttons and logic for our signup/login/logout
 functionality. We're keeping the button UI and function logic in the same file
 for the sake of simplicity. This component is then imported and used in the
 `$lib/components/ui/Header.svelte` component, which in turn is placed on the
 page in the `/src/routes/+layout.svelte` file.

 In its bare state, all the buttons will always show, and there's no actual
 logging in, signing up, etc. taking place. Maybe you want to integrate some
 browser wallet, a smart wallet, or some other means of authenticating users
 with a Stellar account. Might I recommend the Stellar Wallets Kit? It's pretty
 awesome! https://stellarwalletskit.dev

 We do provide some toast logic for informing users of errors, but you can
 modify/delete that as you see fit.
-->

<script lang="ts">
    // We're using toasts to display errors to the user. We're not doing much
    // error _handling_, though. So, use whatever techniques you see fit.
    import { getToastStore } from '@skeletonlabs/skeleton';
    const toastStore = getToastStore();

    /**
     * Sign up as a new user.
     */
    async function signup() {
        console.log('signing up');
        try {
            // Implement the signup logic here
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong signing up. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    /**
     * Log in as an existing user.
     */
    async function login() {
        console.log('logging in');
        try {
            // Implement the login logic here
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong logging in. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }

    /**
     * Log out from the current user session.
     */
    async function logout() {
        console.log('logging out');
        try {
            // Implement the logout logic here
        } catch (err) {
            console.error(err);
            toastStore.trigger({
                message: 'Something went wrong logging out. Please try again later.',
                background: 'variant-filled-error',
            });
        }
    }
</script>

<div class="flex space-x-1 md:space-x-2">
    <button class="btn variant-filled-primary" onclick={signup}>Signup</button>
    <button class="btn variant-soft-primary" onclick={login}>Login</button>
    <button class="btn variant-soft-error" onclick={logout}>Logout</button>
</div>
