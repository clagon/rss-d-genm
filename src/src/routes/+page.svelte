<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from '$lib/components/Icon.svelte';

	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<div class="flex flex-col items-center justify-center px-4 py-10 text-center md:py-20">
	<div class="relative mb-8 inline-block">
		<div
			class="from-primary-500 to-secondary-500 absolute -inset-1 rounded-full bg-gradient-to-r opacity-75 blur-lg transition duration-1000 group-hover:opacity-100 group-hover:duration-200">
		</div>
		<span
			class="text-primary-300 relative inline-flex items-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium ring-1 ring-white/10 md:text-sm">
			<span class="bg-primary-400 mr-2 h-2 w-2 animate-pulse rounded-full"></span>
			New: AI-Powered Feed Discovery
		</span>
	</div>

	<h1 class="mb-6 max-w-4xl text-4xl font-bold tracking-tight md:text-5xl lg:text-7xl">
		<span class="text-white">Your Personal</span>
		<span class="text-gradient mt-2 block">Knowledge Stream</span>
	</h1>

	<p class="mb-10 max-w-2xl px-4 text-base text-slate-400 md:text-lg lg:text-xl">
		Curate, consume, and conquer your information diet with a modern RSS reader designed for the
		21st century.
	</p>

	<div class="flex flex-col gap-4 sm:flex-row">
		<a
			href="/signin"
			class="bg-primary-600 hover:bg-primary-500 focus:ring-primary-500 group relative inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 md:px-8 md:py-3 md:text-base">
			Get Started
			<Icon
				name="arrow_forward"
				size="1.25rem"
				class="-mr-1 ml-2 transition-transform group-hover:translate-x-1" />
		</a>
		<a
			href="/list"
			class="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 px-6 py-2.5 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all duration-200 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900 md:px-8 md:py-3 md:text-base">
			Explore Feeds
		</a>
	</div>

	<!-- Feature Grid -->
	<div
		class="mt-20 grid w-full max-w-6xl gap-6 px-4 sm:grid-cols-2 md:mt-32 md:gap-8 lg:grid-cols-3">
		{#each [{ title: 'Smart Aggregation', desc: 'Automatically categorize and prioritize your feeds using advanced algorithms.', icon: 'hub' }, { title: 'Clean Reading', desc: 'Distraction-free reading mode that puts content first.', icon: 'article' }, { title: 'Cross-Platform', desc: 'Sync your reading progress across all your devices instantly.', icon: 'devices' }] as feature, i}
			<div
				class="glass-card hover:shadow-primary-500/10 group relative overflow-hidden rounded-3xl p-6 text-left transition-all duration-500 hover:-translate-y-2 md:p-8"
				style="animation-delay: {i * 100}ms">
				<div
					class="bg-primary-500/10 text-primary-400 group-hover:bg-primary-500 mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300 group-hover:text-white">
					<Icon
						name={feature.icon}
						size="1.5em" />
				</div>
				<h3 class="mb-3 text-lg font-bold text-white md:text-xl">{feature.title}</h3>
				<p class="text-sm text-slate-400 md:text-base">{feature.desc}</p>
				<div
					class="from-primary-500 to-secondary-500 absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r transition-all duration-500 group-hover:w-full">
				</div>
			</div>
		{/each}
	</div>
</div>
