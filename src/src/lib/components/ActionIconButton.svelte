<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import IconButton from './IconButton.svelte';

	let {
		action,
		values,
		icon,
		class: className = ''
	}: { action: string; values: Record<string, string>; icon: string; class?: string } = $props();
</script>

<form
	method="POST"
	{action}
	class="contents">
	{#each Object.entries(values) as [key, value]}
		<input
			type="hidden"
			name={key}
			{value} />
	{/each}
	<IconButton
		{icon}
		class={className} />
</form>
