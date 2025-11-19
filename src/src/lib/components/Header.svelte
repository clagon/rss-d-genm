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

<header class="sticky top-4 z-50 mx-auto w-[95%] max-w-7xl rounded-2xl glass px-6 py-4 transition-all duration-300 hover:bg-white/15">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-8">
			<h1 class="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-2xl font-bold text-transparent">
				RSS Feeds
			</h1>
			
			<nav class="hidden items-center gap-2 md:flex">
				{#each links.filter((link) => !link.needsAuth || !!user) as link}
					<HeaderLink {...link} />
				{/each}
			</nav>
		</div>

		<div class="flex items-center gap-4">
			{#if user}
				<div class="group flex items-center gap-3 rounded-full bg-white/5 p-1.5 pe-4 transition-colors hover:bg-white/10">
					<img
						class="h-8 w-8 rounded-full border-2 border-primary-500/50"
						src={user.image}
						alt="" />
					<span class="text-sm font-medium text-slate-200 group-hover:text-white">{user.name}</span>
				</div>
				<a
					href="/logout"
					class="flex h-9 items-center rounded-full bg-red-500/20 px-5 text-sm font-bold text-red-200 transition-all hover:bg-red-500 hover:text-white"
					>Logout</a>
			{:else}
				<a
					href="/signin"
					class="flex h-10 items-center rounded-full bg-gradient-to-r from-primary-600 to-secondary-600 px-6 text-sm font-bold text-white shadow-lg shadow-primary-500/20 transition-all hover:scale-105 hover:shadow-primary-500/40"
					>Sign In</a>
			{/if}
		</div>
	</div>
</header>
