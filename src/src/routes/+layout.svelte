<script lang="ts">
	import '../app.css';
	import '@fontsource/barlow/400.css';
	import '@fontsource/barlow/500.css';
	import '@fontsource/barlow/700.css';
	import '@fontsource/yakuhanjps/400.css';
	import '@fontsource/yakuhanjps/500.css';
	import '@fontsource/yakuhanjps/700.css';
	import '@fontsource-variable/noto-sans-jp';
	import { page } from '$app/state';
	import Header from '$lib/components/Header.svelte';
	import '$lib/i18n';
	import { isLoading } from 'svelte-i18n';

	let { data, children } = $props();

	let user = $derived.by(() => data.user);
	let dis: any = $state();
	const links = [
		{ href: '/list', text: 'header.list', icon: 'list' },
		{ href: '/d/feeds', text: 'header.feeds', icon: 'rss_feed', needsAuth: true },
		{ href: '/d/tags', text: 'header.tags', icon: 'bookmark', needsAuth: true }
	];
</script>

<svelte:head>
	<title>{page.data.title || 'RSS'} | RSS Feeds</title>
</svelte:head>

{#if !page?.error}
	<div
		id="app"
		class="selection:bg-primary-500/30 selection:text-primary-200 relative min-h-screen w-full overflow-x-hidden bg-slate-950">
		{#if $isLoading}
			<div class="flex h-screen items-center justify-center">
				<div
					class="border-primary-500 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent">
				</div>
			</div>
		{:else}
			<!-- Abstract Background Shapes -->
			<div class="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				<div
					class="bg-primary-900/20 absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full blur-[120px]">
				</div>
				<div
					class="bg-secondary-900/20 absolute -right-[10%] top-[40%] h-[40%] w-[40%] rounded-full blur-[100px]">
				</div>
				<div
					class="bg-primary-800/20 absolute -bottom-[10%] left-[20%] h-[30%] w-[30%] rounded-full blur-[80px]">
				</div>
			</div>

			<div class="relative z-10 flex min-h-screen flex-col">
				<Header
					{links}
					{user} />

				<main class="container mx-auto flex-1 px-4 py-6 md:px-8 md:py-8">
					{@render children()}
				</main>
			</div>
		{/if}
	</div>
{:else}
	<div class="flex h-screen items-center justify-center bg-slate-950 text-white">
		{@render children()}
	</div>
{/if}
