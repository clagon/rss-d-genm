<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import Status from '$lib/components/Status.svelte';
	import { enhance } from '$app/forms';
	import SearchInput from '$lib/components/SearchInput.svelte';

	let { data, form }: PageProps = $props();
	let dialog: HTMLDialogElement;
	let target = $state<string | null>(null);
	let name = $state<string>('');
	let url = $state<string>('');
	let enabled = $state<boolean>(true);
	let tags = $state<string[]>([]);
	let searchText = $state<string>('');
	let orderby = $state<'name' | 'url' | 'tags' | 'enabled'>('name');
	let order = $state<'asc' | 'desc'>('asc');

	const feeds = $derived.by(() => {
		if (searchText === undefined || searchText === null) {
			return data.feeds;
		}
		return data.feeds
			.sort((a, b) => {
				if (order === 'asc') {
					return `${a[orderby]}`.localeCompare(`${b[orderby]}`);
				} else {
					return `${b[orderby]}`.localeCompare(`${a[orderby]}`);
				}
			})
			.filter(
				(feed) =>
					feed.name?.toLowerCase().includes(searchText.toLowerCase()) ||
					feed.url?.toLowerCase().includes(searchText.toLowerCase()) ||
					feed.tags.some((tag) => tag.name.toLowerCase().includes(searchText.toLowerCase())) ||
					(feed.enabled ? 'Enabled' : 'Disabled').toLowerCase().includes(searchText.toLowerCase())
			);
	});

	const changeOrder = (orderBy: 'name' | 'url' | 'tags' | 'enabled') => {
		if (orderby === orderBy) {
			order = order === 'asc' ? 'desc' : 'asc';
		} else {
			orderby = orderBy;
			order = 'asc';
		}
	};

	const editFeed = (feed: (typeof data.feeds)[0]) => {
		target = feed.id;
		name = feed.name ?? '';
		url = feed.url ?? '';
		enabled = feed.enabled ?? true;
		tags = feed.tags.map((t) => t.id);
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
			<p class="text-lg font-bold text-white">Feeds</p>
			<span
				class="bg-primary-500/20 text-primary-300 border-primary-500/30 inline-block rounded-full border px-3 py-1 text-sm font-bold">
				<span class="me-1">{feeds.length}</span> feeds
			</span>
		</div>
		<div class="flex flex-col gap-3 md:flex-row md:items-center md:gap-4 md:justify-self-end">
			<div class="w-full md:w-64">
				<SearchInput
					bind:value={searchText}
					placeholder="Search feeds..." />
			</div>
			<button
				class="bg-primary-600 hover:bg-primary-500 focus:ring-primary-500 group relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
				onclick={() => {
					target = null;
					name = '';
					url = '';
					tags = [];
					enabled = true;
					dialog.showModal();
				}}>
				<Icon
					name="add"
					size="1.25em"
					class="mr-2" />
				Add Feed
			</button>
		</div>
	</div>

	<!-- Mobile sort controls -->
	<div class="border-b border-slate-700/30 bg-slate-900/30 p-4 md:hidden">
		<div class="flex items-center gap-2">
			<label
				for="sort-select-feeds"
				class="text-sm text-slate-400">Sort:</label>
			<select
				id="sort-select-feeds"
				bind:value={orderby}
				class="focus:border-primary-500 focus:ring-primary-500 flex-1 rounded-lg border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm text-white">
				<option value="name">Name</option>
				<option value="url">URL</option>
				<option value="tags">Tags</option>
				<option value="enabled">Status</option>
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
	<div class="hidden md:grid md:grid-cols-[repeat(3,minmax(0,1fr))_150px_100px]">
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
			<button
				class={[
					'flex cursor-pointer items-center transition-colors hover:text-white',
					orderby === 'url' ? 'text-primary-400 font-bold' : ''
				].join(' ')}
				onclick={() => changeOrder('url')}>
				<span>url</span>
				{#if orderby === 'url'}
					<div class="translate-y-1">
						<Icon
							name={order === 'asc' ? 'arrow_upward' : 'arrow_downward'}
							size="1em"
							fill={true} />
					</div>
				{/if}
			</button>
			<button
				class={[
					'flex cursor-pointer items-center transition-colors hover:text-white',
					orderby === 'tags' ? 'text-primary-400 font-bold' : ''
				].join(' ')}
				onclick={() => changeOrder('tags')}>
				<span>tags</span>
				{#if orderby === 'tags'}
					<div class="translate-y-1">
						<Icon
							name={order === 'asc' ? 'arrow_upward' : 'arrow_downward'}
							size="1em"
							fill={true} />
					</div>
				{/if}
			</button>
			<button
				class={[
					'flex cursor-pointer items-center transition-colors hover:text-white',
					orderby === 'enabled' ? 'text-primary-400 font-bold' : ''
				].join(' ')}
				onclick={() => changeOrder('enabled')}>
				<span>status</span>
				{#if orderby === 'enabled'}
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
		{#each feeds as feed}
			<div
				class="col-span-full grid grid-cols-subgrid gap-2 border-b border-slate-700/30 p-4 text-slate-300 transition-colors last:rounded-b-2xl last:border-0 hover:bg-white/5">
				<p
					class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap font-medium text-white">
					{feed.name}
				</p>
				<p
					class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap px-4 text-slate-400">
					{feed.url}
				</p>
				<Tags tags={feed.tags.map((tag) => tag.name)} />
				<div class="pe-10">
					<Status
						color={feed.enabled ? 'bg-teal-500' : 'bg-rose-500'}
						text={feed.enabled ? 'Enabled' : 'Disabled'} />
				</div>
				<div class="flex items-center gap-2">
					<IconButton
						icon="delete"
						class="text-slate-400 hover:text-red-400" />
					<IconButton
						icon="edit"
						onclick={() => editFeed(feed)}
						class="hover:text-primary-400 text-slate-400" />
				</div>
			</div>
		{/each}
	</div>

	<!-- Mobile card view -->
	<div class="p-4 md:hidden">
		{#each feeds as feed}
			<div class="glass-card mb-3 rounded-xl p-4">
				<div class="mb-3 flex items-start justify-between">
					<div class="flex-1">
						<h3 class="mb-1 font-medium text-white">{feed.name}</h3>
						<p class="break-all text-sm text-slate-400">{feed.url}</p>
					</div>
					<div class="ml-2 flex items-center gap-2">
						<IconButton
							icon="edit"
							onclick={() => editFeed(feed)}
							class="hover:text-primary-400 text-slate-400" />
						<IconButton
							icon="delete"
							class="text-slate-400 hover:text-red-400" />
					</div>
				</div>
				<div class="flex items-center justify-between">
					<Tags tags={feed.tags.map((tag) => tag.name)} />
					<Status
						color={feed.enabled ? 'bg-teal-500' : 'bg-rose-500'}
						text={feed.enabled ? 'Enabled' : 'Disabled'} />
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
			<h2 class="text-2xl font-bold text-white">{target ? 'Edit' : 'Add'} Feed</h2>
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
			<!-- Enable/Disable Toggle -->
			<div class="flex items-center justify-between">
				<label
					for="enabled-toggle"
					class="text-sm font-medium text-slate-300">Status</label>
				<button
					type="button"
					id="enabled-toggle"
					onclick={() => (enabled = !enabled)}
					class="{enabled
						? 'bg-primary-600'
						: 'bg-slate-700'} focus:ring-primary-500 relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900">
					<span class="sr-only">Enable feed</span>
					<span
						class="{enabled
							? 'translate-x-6'
							: 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
					></span>
				</button>
			</div>
			<div class="text-sm text-slate-400">
				{enabled ? 'Feed is enabled' : 'Feed is disabled'}
			</div>
			<input
				type="hidden"
				name="enabled"
				value={enabled} />

			<input
				type="hidden"
				name="id"
				value={target} />

			<!-- Name Input -->
			<div class="flex flex-col gap-2">
				<label
					for="feed-name"
					class="text-sm font-medium text-slate-300">Name</label>
				<input
					id="feed-name"
					type="text"
					name="name"
					bind:value={name}
					required
					class="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2" />
			</div>

			<!-- URL Input -->
			<div class="flex flex-col gap-2">
				<label
					for="feed-url"
					class="text-sm font-medium text-slate-300">URL</label>
				<input
					id="feed-url"
					type="url"
					name="url"
					bind:value={url}
					required
					class="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-white placeholder-slate-500 focus:ring-2" />
			</div>

			<!-- Tags Multi-select -->
			<div class="flex flex-col gap-2">
				<label
					for="feed-tags"
					class="text-sm font-medium text-slate-300">Tags</label>
				<div
					class="flex min-h-[44px] flex-wrap gap-2 rounded-lg border border-slate-700 bg-slate-900/50 p-3">
					{#each data.tags as tag}
						<label class="inline-flex items-center">
							<input
								type="checkbox"
								name="tags"
								value={tag.id}
								checked={tags.includes(tag.id)}
								onchange={(e) => {
									if (e.currentTarget.checked) {
										tags = [...tags, tag.id];
									} else {
										tags = tags.filter((t) => t !== tag.id);
									}
								}}
								class="sr-only" />
							<span
								class="{tags.includes(tag.id)
									? 'bg-primary-600 text-white'
									: 'bg-slate-800/50 text-slate-400'} hover:bg-primary-500 cursor-pointer rounded-full px-3 py-1 text-sm font-medium transition-colors hover:text-white">
								{tag.name}
							</span>
						</label>
					{/each}
				</div>
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
