<script lang="ts">
	import Tag from './Tag.svelte';

	let { tags }: { tags: string[] } = $props();
</script>

<div class="flex items-center gap-2">
	{#if tags && tags.length > 0}
		{#each tags as tag}
			<Tag {tag} />
		{/each}
	{:else}
		<span class="inline-block py-1 text-sm">&nbsp; </span>
	{/if}
</div>
