<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	let {
		icon,
		onclick = () => {},
		class: className = ''
	}: { icon: string; onclick?: () => void; class?: string } = $props();
</script>

<button
	class="flex aspect-square items-center justify-center rounded-full p-2 font-bold transition-colors hover:bg-gray-200/40 {className}"
	{onclick}>
	<Icon
		name={icon}
		size="1.3em"
		fill={true} />
</button>
