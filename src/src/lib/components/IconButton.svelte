<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	let { icon, onclick = () => {} }: { icon: string; onclick?: () => void } = $props();
</script>

<button
	class="flex aspect-square items-center justify-center rounded-full p-2 font-bold hover:bg-gray-200/40"
	{onclick}>
	<Icon
		name={icon}
		size="1.3em"
		fill={true} />
</button>
