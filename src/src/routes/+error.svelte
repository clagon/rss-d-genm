<script lang="ts">
	import { page } from '$app/state';
	import Icon from '$lib/components/Icon.svelte';
	import { t } from 'svelte-i18n';
</script>

<div class="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
	<div
		class="glass-card relative flex max-w-lg flex-col items-center overflow-hidden rounded-3xl p-12">
		<div class="bg-primary-500/20 absolute -right-24 -top-24 h-48 w-48 rounded-full blur-3xl"></div>
		<div class="bg-secondary-500/20 absolute -bottom-24 -left-24 h-48 w-48 rounded-full blur-3xl">
		</div>

		<div
			class="text-primary-400 mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full bg-slate-800/50 ring-1 ring-white/10">
			<Icon
				name="error"
				size="4em" />
		</div>

		<h1 class="text-gradient mb-2 text-8xl font-bold tracking-tighter">{page.status}</h1>

		<h2 class="mb-6 text-2xl font-bold text-white">
			{page?.error?.message || $t('error.not_found')}
		</h2>

		<p class="mb-8 text-slate-400">
			{$t('error.not_found_desc')}
		</p>

		{#if page.error}
			<pre
				class="mb-8 max-w-full overflow-auto rounded bg-slate-800 p-4 text-left text-xs text-red-400">
				{JSON.stringify(page.error, null, 2)}
				{page.error.stack}
			</pre>
		{/if}

		<a
			href="/"
			class="bg-primary-600 hover:bg-primary-500 focus:ring-primary-500 group relative inline-flex items-center justify-center rounded-full px-8 py-3 text-base font-semibold text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900">
			<Icon
				name="home"
				size="1.25em"
				class="mr-2" />
			{$t('error.go_home')}
		</a>
	</div>
</div>
