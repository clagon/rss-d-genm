<script lang="ts">
	import { Li, Badge } from 'flowbite-svelte';

	export let feed: { name: string; url: string; tags: string[] };
</script>

<Li class="list-item">
	<div>
		<a href={feed.url} target="_blank" rel="noopener noreferrer" class="feed-name">{feed.name}</a>
		<p class="feed-url">{feed.url}</p>
	</div>
	<div>
		{#each feed.tags as tag}
			<Badge>{tag}</Badge>
		{/each}
	</div>
</Li>

<style>
	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.feed-name {
		font-size: 1.125rem;
		font-weight: 600;
	}
	.feed-url {
		font-size: 0.875rem;
		color: #6b7280;
	}
</style>
