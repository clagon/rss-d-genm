<script lang="ts">
	import Icon from '$lib/components/Icon.svelte';
	import { page } from '$app/state';

	let { href, text, icon }: { href: string; text: string; icon: string } = $props();

	let isActive = $derived(page.url.pathname === href);
</script>

<a
	{href}
	class="group relative flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-300 {isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}">
	
	<span class="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-110 {isActive ? 'text-primary-400' : 'text-slate-400 group-hover:text-primary-300'}">
		<Icon
			name={icon}
			size="1.2em"
			color="currentColor"
			fill={isActive} />
	</span>
	<span class="text-sm font-medium">{text}</span>
	
	{#if isActive}
		<span class="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primary-500/10 to-secondary-500/10 blur-sm"></span>
	{/if}
</a>
