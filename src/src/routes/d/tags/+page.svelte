<script lang="ts">
	import ActionIconButton from '$lib/components/ActionIconButton.svelte';
	import IconButton from '$lib/components/IconButton.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import type { PageProps } from './$types';
	import { onMount } from 'svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import { MultiSelect, Search } from 'flowbite-svelte';
	import Tag from '$lib/components/Tag.svelte';
	import Status from '$lib/components/Status.svelte';

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

	onMount(() => {
		if (form && form.tag && form.tag.id) {
			console.log('Editing feed:', form.tag);
			target = form.tag.id;
			name = form.tag?.name ?? '';
			discord_webhook_url = form.tag?.discord_webhook_url ?? '';
			discord_channel_id = form.tag?.discord_channel_id ?? '';
			dialog.showModal();
		}
	});
</script>

<div class="rounded-2xl border border-gray-300">
	<div class="grid grid-cols-2 rounded-t-2xl border-b border-gray-300 p-4">
		<div class="flex items-center gap-2">
			<p class="text-lg font-bold">Tags</p>
			<span class="inline-block rounded-full bg-teal-300 px-3 py-1 text-sm font-bold text-white">
				<span class="me-1">{tags.length}</span> tags
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
					discord_webhook_url = '';
					discord_channel_id = '';
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
	<div class="grid grid-cols-[repeat(1,minmax(0,1fr))_100px]">
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
			<div></div>
		</div>
		{#each tags as tag}
			<div
				class="col-span-full grid grid-cols-subgrid gap-2 p-4 last:rounded-b-2xl even:bg-slate-100">
				<p class="flex items-center overflow-hidden text-ellipsis whitespace-nowrap">{tag.name}</p>
				<div class="flex items-center gap-2">
					<IconButton icon="delete" />
					<ActionIconButton
						icon="edit"
						action="?/get"
						values={{ id: tag.id }} />
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
				label="Discord Webhook URL"
				name="discord_webhook_url"
				bind:value={discord_webhook_url}
				required />
			<TextInput
				label="Discord Channel ID"
				name="discord_channel_id"
				bind:value={discord_channel_id}
				required />
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
