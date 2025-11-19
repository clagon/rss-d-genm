<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import SearchInput from '$lib/components/SearchInput.svelte';

	let { data, form }: PageProps = $props();
	let dialog: HTMLDialogElement;
	let target = $state<string | null>(null);
	let name = $state<string>('');
	let discord_webhook_url = $state<string>('');
	let discord_channel_id = $state<string>('');
	let searchText = $state<string>('');
	let orderby = $state<'name'>('name');
	let order = $state<'asc' | 'desc'>('asc');

	const tags = $derived.by(() => {
		if (searchText === undefined || searchText === null) {
			return data.tags;
		}
		return data.tags
			.sort((a, b) => {
				if (order === 'asc') {
					return `${a[orderby]}`.localeCompare(`${b[orderby]}`);
				} else {
					return `${b[orderby]}`.localeCompare(`${a[orderby]}`);
				}
			})
			.filter((tag) => tag.name?.toLowerCase().includes(searchText.toLowerCase()));
	});

	const changeOrder = (orderBy: 'name' | 'url' | 'tags' | 'enabled') => {
		if (orderby === orderBy) {
			order = order === 'asc' ? 'desc' : 'asc';
		}
	};

	const editTag = (tag: (typeof data.tags)[0]) => {
		target = tag.id;
		name = tag.name ?? '';
		discord_webhook_url = tag.discord_webhook_url ?? '';
		discord_channel_id = tag.discord_channel_id ?? '';
		dialog.showModal();
	};

	onMount(() => {
		// Client-side edit logic replaces the need for this check
	});
</script>

<div class="glass-card rounded-2xl border-0">
	<div
		class="flex flex-col gap-4 rounded-t-2xl border-b border-slate-700/50 bg-slate-900/50 p-4 md:grid md:grid-cols-2">
		<div class="flex items-center gap-2">
			<p class="text-lg font-bold text-white">Tags</p>
			<span
				class="bg-primary-500/20 text-primary-300 border-primary-500/30 inline-block rounded-full border px-3 py-1 text-sm font-bold">
				<span class="me-1">{tags.length}</span> tags
			</span>
		</div>
		<div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 md:justify-self-end">
			<div class="w-full md:w-64">
				<SearchInput
					bind:value={searchText}
					placeholder="Search tags..." />
			</div>
			<button
				class="bg-primary-600 hover:bg-primary-500 focus:ring-primary-500 group relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
				onclick={() => {
					target = null;
					name = '';
					discord_webhook_url = '';
					discord_channel_id = '';
					dialog.showModal();
				}}>
				<Icon
					name="add"
					size="1.25em"
					class="mr-2" />
				Add Tag
			</button>
		</div>
	</div>

	<!-- Mobile sort controls -->
	<div class="border-b border-slate-700/30 bg-slate-900/30 p-4 md:hidden">
		<div class="flex items-center gap-2">
			<label
				for="sort-select-tags"
				class="text-sm text-slate-400">Sort:</label>
			<select
				id="sort-select-tags"
				bind:value={orderby}
				class="focus:border-primary-500 focus:ring-primary-500 flex-1 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white">
				<option value="name">Name</option>
			</select>
			<button
				onclick={() => (order = order === 'asc' ? 'desc' : 'asc')}
				class="flex items-center justify-center rounded-lg bg-slate-800/50 p-2 text-slate-300 hover:bg-slate-800 hover:text-white">
				<Icon
					name={order === 'asc' ? 'arrow_upward' : 'arrow_downward'}
					size="1.25em" />
			</button>
		</div>
	</div>

	<!-- Desktop table view -->
	<div class="hidden md:grid md:grid-cols-[repeat(1,minmax(0,1fr))_100px]">
		<div
			class="col-span-full grid grid-cols-subgrid gap-2 border-b border-slate-700/50 p-4 text-sm font-medium uppercase tracking-wider text-slate-400">
			<button
				class={[
					'flex cursor-pointer items-center transition-colors hover:text-white',
					orderby === 'name' ? 'text-primary-400 font-bold' : ''
				].join(' ')}
				onclick={() => changeOrder('name')}>
				<span>name</span>
				{#if orderby === 'name'}
					<div class="translate-y-1">
						<Icon
							name={order === 'asc' ? 'arrow_upward' : 'arrow_downward'}
							size="1em"
							fill={true} />
					</div>
				{/if}
			</button>
			<div></div>
		</div>
		{#each tags as tag}
			<div
				class="col-span-full grid grid-cols-subgrid gap-2 border-b border-slate-700/30 p-4 text-slate-300 transition-colors last:rounded-b-2xl last:border-0 hover:bg-white/5">
				<p
					class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap font-medium text-white">
					{tag.name}
				</p>
				<div class="flex items-center gap-2">
					<IconButton
						icon="delete"
						class="text-slate-400 hover:text-red-400" />
					<IconButton
						icon="edit"
						onclick={() => editTag(tag)}
						class="hover:text-primary-400 text-slate-400" />
				</div>
			</div>
		{/each}
	</div>

	<!-- Mobile card view -->
	<div class="p-4 md:hidden">
		{#each tags as tag}
			<div class="glass-card mb-3 rounded-xl p-4">
				<div class="flex items-center justify-between">
					<h3 class="font-medium text-white">{tag.name}</h3>
					<div class="flex items-center gap-2">
						<IconButton
							icon="edit"
							onclick={() => editTag(tag)}
							class="hover:text-primary-400 text-slate-400" />
						<IconButton
							icon="delete"
							class="text-slate-400 hover:text-red-400" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
<dialog
	bind:this={dialog}
	class="m-auto min-w-[90%] max-w-[90%] overflow-visible bg-transparent md:min-w-[500px] md:max-w-[500px]">
	<div class="glass-card relative overflow-hidden rounded-2xl">
		<!-- Background blurs -->
		<div class="bg-primary-500/20 absolute -right-24 -top-24 h-48 w-48 rounded-full blur-3xl"></div>
		<div class="bg-secondary-500/20 absolute -bottom-24 -left-24 h-48 w-48 rounded-full blur-3xl">
		</div>

		<!-- Header -->
		<div class="relative flex items-center justify-between border-b border-slate-700/50 p-6">
			<h2 class="text-2xl font-bold text-white">{target ? 'Edit' : 'Add'} Tag</h2>
			<IconButton
				icon="close"
				onclick={() => dialog.close()}
				class="text-slate-400 hover:text-white" />
		</div>

		<!-- Form -->
		<form
			method="POST"
			action="?/register"
			use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						dialog.close();
					}
				};
			}}
			class="relative flex flex-col gap-6 p-6">
			<input
				type="hidden"
				name="id"
				value={target} />

			<!-- Name Input -->
			<div class="flex flex-col gap-2">
				<label
					for="tag-name"
					class="text-sm font-medium text-slate-300">Name</label>
				<input
					id="tag-name"
					type="text"
					name="name"
					bind:value={name}
					required
					class="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2" />
			</div>

			<!-- Discord Webhook URL Input -->
			<div class="flex flex-col gap-2">
				<label
					for="discord-webhook"
					class="text-sm font-medium text-slate-300">Discord Webhook URL</label>
				<input
					id="discord-webhook"
					type="url"
					name="discord_webhook_url"
					bind:value={discord_webhook_url}
					required
					class="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2" />
			</div>

			<!-- Discord Channel ID Input -->
			<div class="flex flex-col gap-2">
				<label
					for="discord-channel"
					class="text-sm font-medium text-slate-300">Discord Channel ID</label>
				<input
					id="discord-channel"
					type="text"
					name="discord_channel_id"
					bind:value={discord_channel_id}
					required
					class="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2" />
			</div>

			<!-- Buttons -->
			<div class="mt-4 grid grid-cols-2 items-center gap-4">
				<button
					type="button"
					onclick={() => dialog.close()}
					class="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 font-semibold text-slate-300 transition-all hover:bg-slate-800 hover:text-white">
					Cancel
				</button>
				<button
					type="submit"
					class="bg-primary-600 hover:bg-primary-500 focus:ring-primary-500 rounded-lg px-4 py-2.5 font-semibold text-white transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900">
					Save
				</button>
			</div>
		</form>
	</div>
</dialog>
