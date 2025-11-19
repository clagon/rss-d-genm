<script lang="ts">
	import HeaderLink from '$lib/components/HeaderLink.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let {
		links,
		user
	}: {
		links: Array<{ href: string; text: string; icon: string; needsAuth?: boolean }>;
		user: any;
	} = $props();

	let mobileMenuOpen = $state(false);
</script>

<header
	class="glass sticky top-2 z-50 mx-auto w-[95%] max-w-7xl rounded-2xl px-4 py-3 transition-all duration-300 hover:bg-white/15 md:top-4 md:px-6 md:py-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4 md:gap-8">
			<h1
				class="from-primary-400 to-secondary-400 bg-gradient-to-r bg-clip-text text-xl font-bold text-transparent md:text-2xl">
				RSS Feeds
			</h1>

			<nav class="hidden items-center gap-2 md:flex">
				{#each links.filter((link) => !link.needsAuth || !!user) as link}
					<HeaderLink {...link} />
				{/each}
			</nav>
		</div>

		<div class="flex items-center gap-2 md:gap-4">
			{#if user}
				<div
					class="group flex items-center gap-2 rounded-full bg-white/5 p-1.5 transition-colors hover:bg-white/10 md:gap-3 md:pe-4">
					<img
						class="border-primary-500/50 h-7 w-7 rounded-full border-2 md:h-8 md:w-8"
						src={user.image}
						alt="" />
					<span class="hidden text-sm font-medium text-slate-200 group-hover:text-white sm:inline"
						>{user.name}</span>
				</div>
				<a
					href="/logout"
					class="hidden h-9 items-center rounded-full bg-red-500/20 px-5 text-sm font-bold text-red-200 transition-all hover:bg-red-500 hover:text-white sm:flex"
					>Logout</a>
			{:else}
				<a
					href="/signin"
					class="from-primary-600 to-secondary-600 shadow-primary-500/20 hover:shadow-primary-500/40 flex h-9 items-center rounded-full bg-gradient-to-r px-4 text-xs font-bold text-white shadow-lg transition-all hover:scale-105 md:h-10 md:px-6 md:text-sm"
					>Sign In</a>
			{/if}

			<!-- Mobile menu button -->
			<button
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white transition-colors hover:bg-white/10 md:hidden"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}>
				<Icon
					name={mobileMenuOpen ? 'close' : 'menu'}
					size="1.5em" />
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileMenuOpen}
		<nav class="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 md:hidden">
			{#each links.filter((link) => !link.needsAuth || !!user) as link}
				<a
					href={link.href}
					class="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
					onclick={() => (mobileMenuOpen = false)}>
					<Icon
						name={link.icon}
						size="1.25em" />
					<span class="font-medium">{link.text}</span>
				</a>
			{/each}
			{#if user}
				<a
					href="/logout"
					class="flex items-center gap-3 rounded-lg px-4 py-3 text-red-300 transition-colors hover:bg-red-500/20 hover:text-red-200"
					onclick={() => (mobileMenuOpen = false)}>
					<Icon
						name="logout"
						size="1.25em" />
					<span class="font-medium">Logout</span>
				</a>
			{/if}
		</nav>
	{/if}
</header>
