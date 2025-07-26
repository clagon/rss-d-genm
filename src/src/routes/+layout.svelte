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

	let { data, children } = $props();

	let user = $derived.by(() => data.user);
	let dis: any = $state();
	const links = [
		{ href: '/list', text: 'List', icon: 'list' },
		{ href: '/d/feeds', text: 'Feeds', icon: 'rss_feed', needsAuth: true },
		{ href: '/d/tags', text: 'Tags', icon: 'bookmark', needsAuth: true }
	];
</script>

<svelte:head>
	<title>{page.data.title || 'RSS'} | RSS Feeds</title>
</svelte:head>
{#if !page?.error}
	<div
		id="app"
		class="bg-linear-to-b flex min-h-screen w-full flex-col from-gray-200 from-10% to-gray-100 p-10">
		<Header
			{links}
			{user} />
		<main class="rounded-4xl mt-3 flex-1 bg-slate-50 p-8">
			{@render children()}
		</main>
	</div>
{:else}
	<div class="flex h-screen items-center justify-center">
		{@render children()}
	</div>
{/if}
