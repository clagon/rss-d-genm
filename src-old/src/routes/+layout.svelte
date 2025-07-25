<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	// import { supabase } from '$lib/supabaseClient';

	let { data, children } = $props();
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidateAll();
			}
		});
		return () => data.subscription.unsubscribe();
	});
</script>

<Header />

<main>
	{@render children()}
</main>

<style>
	main {
		padding: 1rem;
	}
</style>
