<script lang="ts">
	import { List, Input, Gallery, Badge } from 'flowbite-svelte';

	export let feeds: { name: string; url: string; tags: string[] }[];

	let searchTerm = '';

	$: filteredFeeds = feeds.filter((feed) => {
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		return (
			feed.name.toLowerCase().includes(lowerCaseSearchTerm) ||
			feed.url.toLowerCase().includes(lowerCaseSearchTerm) ||
			feed.tags.some((tag) => tag.toLowerCase().includes(lowerCaseSearchTerm))
		);
	});
</script>

<div class="search-container">
	<Input type="text" placeholder="Search feeds..." bind:value={searchTerm} />
</div>

<List tag="dl">
	<Gallery class="grid grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] gap-6">
		{#each filteredFeeds as feed (feed.url)}
			<div class="rounded-lg border border-gray-300 p-4">
				<p>{feed.name}</p>
				<p>{feed.url}</p>
				<span class="mt-2 flex flex-wrap gap-2">
					{#each feed.tags as tag (tag)}
						<Badge>{tag}</Badge>
					{/each}
				</span>
			</div>
		{/each}
		{#if filteredFeeds.length === 0}
			<p>No feeds found.</p>
		{/if}
	</Gallery>
</List>

<style>
	.search-container {
		margin-bottom: 1rem;
	}
</style>
