<script lang="ts">
	import HeaderLink from '$lib/components/HeaderLink.svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let {
		links,
		user
	}: {
		links: Array<{ href: string; text: string; icon: string; needsAuth?: boolean }>;
		user: any;
	} = $props();
</script>

<header class="grid grid-cols-[200px_1fr_200px] rounded-full bg-slate-50 py-3 pe-3 ps-6 shadow-sm">
	<h1 class="flex shrink items-center text-lg font-bold">RSS Feeds</h1>
	<nav class="flex items-center justify-center gap-4">
		{#each links.filter((link) => !link.needsAuth || !!user) as link}
			<HeaderLink {...link} />
		{/each}
	</nav>
	<div class="flex items-center gap-4 justify-self-end">
		{#if user}
			<div class="flex h-10 items-center gap-2 rounded-full bg-gray-200/60 p-1 pe-4">
				<img
					class="h-full rounded-full"
					src={user.image}
					alt="" />
				<span class="flex items-center font-bold">{user.name}</span>
			</div>
			<a
				href="/logout"
				class="flex h-10 items-center rounded-full bg-red-500 px-5 py-2 font-bold text-white"
				>Logout</a>
		{:else}
			<a
				href="/signin"
				class="flex h-10 items-center rounded-full bg-teal-300 px-5 py-2 font-bold text-white"
				>Sign In</a>
		{/if}
	</div>
</header>
