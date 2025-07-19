<script lang="ts">
	import { Li, Badge } from 'flowbite-svelte';

	export let feed: { name: string; url: string; tags: string[] };
</script>

<Li class="flex justify-between items-center">
	<div>
		<a href={feed.url} target="_blank" rel="noopener noreferrer" class="text-lg font-semibold">{feed.name}</a>
		<p class="text-sm text-gray-500">{feed.url}</p>
	</div>
	<div>
		{#each feed.tags as tag}
			<Badge>{tag}</Badge>
		{/each}
	</div>
</Li>
