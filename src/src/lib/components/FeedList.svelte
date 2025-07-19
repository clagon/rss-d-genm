<script lang="ts">
	import { List, Input } from 'flowbite-svelte';
	import FeedListItem from './FeedListItem.svelte';

	// TODO: Replace with actual data
	const allFeeds = [
		{ name: 'Google AI Blog', url: 'https://ai.googleblog.com/feeds/posts/default', tags: ['AI', 'Google'] },
		{ name: 'Svelte Blog', url: 'https://svelte.dev/blog/rss.xml', tags: ['Svelte', 'WebDev'] },
		{ name: 'TypeScript Blog', url: 'https://devblogs.microsoft.com/typescript/feed/', tags: ['TypeScript', 'WebDev'] },
		{ name: 'React Blog', url: 'https://react.dev/feed.xml', tags: ['React', 'WebDev'] },
	];

	let searchTerm = '';

	$: filteredFeeds = allFeeds.filter(feed => {
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		return (
			feed.name.toLowerCase().includes(lowerCaseSearchTerm) ||
			feed.url.toLowerCase().includes(lowerCaseSearchTerm) ||
			feed.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))
		);
	});
</script>

<div class="mb-4">
	<Input type="text" placeholder="Search feeds..." bind:value={searchTerm} />
</div>

<List>
	{#each filteredFeeds as feed}
		<FeedListItem {feed} />
	{/each}
</List>

