<script lang="ts">
	import ActionIconButton from '$lib/components/ActionIconButton.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { MultiSelect, Search, Toggle } from 'flowbite-svelte';
	import Tag from '$lib/components/Tag.svelte';
	import Status from '$lib/components/Status.svelte';

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

	onMount(() => {
		if (form && form.feed && form.feed.id) {
			console.log('Editing feed:', form.feed);
			target = form.feed.id;
			name = form.feed?.name ?? '';
			url = form.feed?.url ?? '';
			enabled = form.feed?.enabled ?? true;
			tags = form.feed?.tags ?? [];
			dialog.showModal();
		}
	});
</script>

<div class="rounded-2xl border border-gray-300">
	<div class="grid grid-cols-2 rounded-t-2xl border-b border-gray-300 p-4">
		<div class="flex items-center gap-2">
			<p class="text-lg font-bold">Feeds</p>
			<span class="inline-block rounded-full bg-teal-300 px-3 py-1 text-sm font-bold text-white">
				<span class="me-1">{feeds.length}</span> feeds
			</span>
		</div>
		<div class="flex items-center gap-4 justify-self-end">
			<Search
				clearable
				bind:value={searchText} />
			<button
				class="flex h-full items-center whitespace-nowrap rounded-lg bg-teal-300 font-bold text-white hover:bg-teal-400"
				onclick={() => {
					target = null;
					name = '';
					url = '';
					tags = [];
					enabled = true;
					dialog.showModal();
				}}>
				<div class="flex aspect-square h-full items-center justify-center p-2">
					<Icon
						name="add"
						size="1.3em"
						fill={true} />
				</div>
				<span class="-translate-y-0.5 pe-3 ps-0">Add Feed</span>
			</button>
		</div>
	</div>
	<div class="grid grid-cols-[repeat(3,minmax(0,1fr))_150px_100px]">
		<div class="col-span-full grid grid-cols-subgrid gap-2 p-4">
			<button
				class={[
					'flex cursor-pointer items-center',
					orderby === 'name' ? 'font-bold text-teal-500' : ''
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
					'flex cursor-pointer items-center',
					orderby === 'url' ? 'font-bold text-teal-500' : ''
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
					'flex cursor-pointer items-center',
					orderby === 'tags' ? 'font-bold text-teal-500' : ''
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
					'flex cursor-pointer items-center',
					orderby === 'enabled' ? 'font-bold text-teal-500' : ''
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
				class="col-span-full grid grid-cols-subgrid gap-2 p-4 last:rounded-b-2xl even:bg-slate-100">
				<p class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">{feed.name}</p>
				<p class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap px-4">
					{feed.url}
				</p>
				<Tags tags={feed.tags.map((tag) => tag.name)} />
				<div class="pe-10">
					<Status
						color={feed.enabled ? 'bg-teal-500' : 'bg-rose-500'}
						text={feed.enabled ? 'Enabled' : 'Disabled'} />
				</div>
				<div class="flex items-center gap-2">
					<IconButton icon="delete" />
					<ActionIconButton
						icon="edit"
						action="?/get"
						values={{ id: feed.id, name: feed.name ?? '', url: feed.url ?? '' }} />
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
