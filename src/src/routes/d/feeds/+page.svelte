<script lang="ts">
	import ActionIconButton from '$lib/components/ActionIconButton.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { MultiSelect, Toggle } from 'flowbite-svelte';
	import Tag from '$lib/components/Tag.svelte';
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
	<div class="grid grid-cols-2 rounded-t-2xl border-b border-slate-700/50 bg-slate-900/50 p-4">
		<div class="flex items-center gap-2">
			<p class="text-lg font-bold text-white">Feeds</p>
			<span
				class="bg-primary-500/20 text-primary-300 border-primary-500/30 inline-block rounded-full border px-3 py-1 text-sm font-bold">
				<span class="me-1">{feeds.length}</span> feeds
			</span>
		</div>
		<div class="flex items-center gap-4 justify-self-end">
			<div class="w-64">
				<SearchInput
					bind:value={searchText}
					placeholder="Search feeds..." />
			</div>
			<button
				class="bg-primary-600 hover:bg-primary-500 focus:ring-primary-500 group relative inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900"
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
	<div class="grid grid-cols-[repeat(3,minmax(0,1fr))_150px_100px]">
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
</div>
<dialog
	bind:this={dialog}
	class="m-auto min-w-[400px] max-w-[90%] overflow-visible bg-transparent">
	<div class="[block-size: 100%] rounded-2xl bg-white shadow-lg">
		<div class="grid grid-cols-2 items-center border-b border-gray-300 p-4">
			<p class="text-xl font-bold">{target ? 'Edit' : 'Add'} feed</p>
			<div class="justify-self-end">
				<IconButton
					icon="close"
					onclick={() => dialog.close()} />
			</div>
		</div>
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
			class="relative flex flex-col gap-4 p-4">
			<Toggle
				bind:checked={enabled}
				name="enabled">{enabled ? 'Enabled' : 'Disabled'}</Toggle>

			<input
				type="hidden"
				name="id"
				value={target} />
			<TextInput
				label="Name"
				name="name"
				bind:value={name}
				required />
			<TextInput
				label="URL"
				name="url"
				bind:value={url}
				required />
			<label
				for="tags"
				class="flex flex-col gap-2">
				<span> Tags </span>
			</label>
			<MultiSelect
				name="tags"
				id="tags"
				items={data.tags.map((tag) => ({ value: tag.id, name: tag.name }))}
				bind:value={tags}
				size="lg">
				{#snippet children({ item, clear })}
					<Tag tag={`${item.name}`} />
				{/snippet}
			</MultiSelect>
			<!-- <input
				type="hidden"
				name="tags"
				value={tags} /> -->
			<div class="mt-3 grid grid-cols-2 items-center gap-4">
				<button
					type="button"
					class="rounded-lg border border-gray-300 px-4 py-2 font-bold hover:bg-gray-200"
					onclick={() => dialog.close()}>cancel</button>
				<button
					type="submit"
					class="rounded-lg bg-teal-300 px-4 py-2 font-bold text-white hover:bg-teal-400"
					>Save</button>
			</div>
		</form>
	</div>
</dialog>
