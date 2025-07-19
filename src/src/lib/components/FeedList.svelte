<script lang="ts">
	import { List } from 'flowbite-svelte';
	import FeedListItem from './FeedListItem.svelte';

	// TODO: Replace with actual data
	const feeds = [
		{ name: 'Google AI Blog', url: 'https://ai.googleblog.com/feeds/posts/default', tags: ['AI', 'Google'] },
		{ name: 'Svelte Blog', url: 'https://svelte.dev/blog/rss.xml', tags: ['Svelte', 'WebDev'] },
	];
</script>

<List>
	{#each feeds as feed}
		<FeedListItem {feed} />
	{/each}
</List>

