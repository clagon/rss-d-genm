<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { supabase } from '$lib/supabaseClient';

	async function signInWithDiscord() {
		await supabase.auth.signInWithOAuth({
			provider: 'discord',
			options: {
				redirectTo: `${window.location.origin}/auth/callback`
			}
		});
	}
</script>

<div class="flex h-screen items-center justify-center">
	<div class="w-full max-w-md rounded-lg border p-8 text-center shadow-md">
		<h1 class="mb-4 text-2xl font-bold">Welcome to RSS-D-GENM</h1>
		<p class="mb-6 text-gray-600">Please sign in to continue</p>
		<Button onclick={signInWithDiscord} size="lg">Sign In with Discord</Button>
	</div>
</div>
