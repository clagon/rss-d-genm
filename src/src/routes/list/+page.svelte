<script lang="ts">
	import type { PageProps } from './$types';
	import FeedCard from '$lib/components/FeedCard.svelte';

	let { data }: PageProps = $props();
</script>

<div class="grid grid-cols-2 gap-2 max-lg:grid-cols-1">
	{#if data.feeds.length === 0}
		<p class="col-span-4 text-center text-gray-500">No feeds available.</p>
	{/if}
	{#each data.feeds as feed}
		<FeedCard {feed} />
	{/each}
</div>
