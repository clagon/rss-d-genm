<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';

	let { href, text, icon }: { href: string; text: string; icon: string } = $props();
</script>

<a
	{href}
	class="flex items-center gap-2 rounded-full bg-gray-200/60 p-1 pe-4 font-bold text-zinc-700 hover:bg-zinc-200">
	<span class="flex aspect-square h-full items-center justify-center rounded-full bg-slate-50 p-2">
		<Icon
			name={icon}
			size="1em"
			color="currentColor"
			fill={true} />
	</span>
	<p class="text-sm">{text}</p>
</a>
