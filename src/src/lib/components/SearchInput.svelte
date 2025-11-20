<script lang="ts">
	import Icon from './Icon.svelte';

	import { t } from 'svelte-i18n';

	let {
		value = $bindable(''),
		placeholder = $t('common.search')
	}: {
		value?: string;
		placeholder?: string;
	} = $props();
</script>

<div class="relative flex items-center">
	<div class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3">
		<Icon
			name="search"
			size="1.25em"
			class="text-slate-400" />
	</div>
	<input
		type="text"
		bind:value
		class="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg border border-slate-700 bg-slate-900/50 p-2.5 ps-10 text-sm text-white placeholder-slate-400"
		{placeholder} />
</div>
