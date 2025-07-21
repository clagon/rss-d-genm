<script lang="ts">
	import { List, Input } from 'flowbite-svelte';
	import FeedListItem from './FeedListItem.svelte';

	export let feeds: { name: string; url: string; tags: string[] }[];

	let searchTerm = '';

	$: filteredFeeds = feeds.filter(feed => {
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		return (
			feed.name.toLowerCase().includes(lowerCaseSearchTerm) ||
			feed.url.toLowerCase().includes(lowerCaseSearchTerm) ||
			feed.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
		);
	});
</script>

<div class="search-container">
	<Input type="text" placeholder="Search feeds..." bind:value={searchTerm} />
</div>

<List>
	{#each filteredFeeds as feed}
		<FeedListItem {feed} />
	{/each}
</List>

<style>
	.search-container {
		margin-bottom: 1rem;
	}
</style>

