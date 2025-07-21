<script lang="ts">
	import {
		Button,
		Badge,
		Indicator,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell
	} from 'flowbite-svelte';
	import FeedEditor from '$lib/components/FeedEditor.svelte';
	import * as feedApi from '$lib/api/feeds';
	import * as tagApi from '$lib/api/tags';
	import { onMount } from 'svelte';

	interface Feed {
		id: string;
		name: string;
		url: string;
		tags: string[];
		enabled: boolean;
	}

	interface Tag {
		id: string;
		name: string;
		discord_channel_id: string;
		discord_webhook_url: string;
	}

	let feeds: Feed[] = $state([]);
	let availableTags: Tag[] = $state([]);
	let showFeedEditor = $state(false);
	let currentFeed: Feed = $state({
		id: '',
		name: '',
		url: '',
		tags: [] as string[],
		enabled: true
	});

	onMount(async () => {
		feeds = await feedApi.getAllFeeds();
		availableTags = await tagApi.getAllTags();
	});

	function openNewFeedModal() {
		currentFeed = { id: '', name: '', url: '', tags: [] as string[], enabled: true };
		showFeedEditor = true;
	}

	function openEditFeedModal(feedToEdit: Feed) {
		currentFeed = { ...feedToEdit };
		showFeedEditor = true;
	}

	async function handleDeleteFeed(id: string) {
		if (confirm('Are you sure you want to delete this feed?')) {
			await feedApi.deleteFeed(id);
			feeds = await feedApi.getAllFeeds(); // Refresh list
		}
	}

	async function handleSaveFeed(event: CustomEvent) {
		const savedFeed = event.detail;
		if (savedFeed.id) {
			await feedApi.updateFeed(savedFeed);
		} else {
			await feedApi.createFeed(savedFeed);
		}
		feeds = await feedApi.getAllFeeds(); // Refresh list
		showFeedEditor = false;
	}
</script>

<h1>Admin Feeds</h1>

<div class="add-button-container">
	<Button onclick={openNewFeedModal}>Add New Feed</Button>
</div>

<Table>
	<TableHead>
		<TableHeadCell>Name</TableHeadCell>
		<TableHeadCell>URL</TableHeadCell>
		<TableHeadCell>Tags</TableHeadCell>
		<TableHeadCell>Enabled</TableHeadCell>
		<TableHeadCell>Actions</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each feeds as feed}
			<TableBodyRow>
				<TableBodyCell class="feed-name">{feed.name}</TableBodyCell>
				<TableBodyCell>{feed.url}</TableBodyCell>
				<TableBodyCell>
					<span class="tag-container">
						{#each feed.tags as tag}
							<Badge>{tag}</Badge>
						{/each}
					</span>
				</TableBodyCell>
				<TableBodyCell>
					<div class="feed-enabled">
						<Indicator color={feed.enabled ? 'green' : 'red'} /><span
							>{feed.enabled ? 'Enabled' : 'Disabled'}</span
						>
					</div>
				</TableBodyCell>
				<TableBodyCell>
					<Button size="sm" class="mr-2" onclick={() => openEditFeedModal(feed)}>Edit</Button>
					<Button size="sm" color="red" onclick={() => handleDeleteFeed(feed.id)}>Delete</Button>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>

<FeedEditor
	bind:open={showFeedEditor}
	bind:feed={currentFeed}
	availableTags={availableTags.map((t) => t.name)}
	on:save={handleSaveFeed}
/>

<style>
	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}
	.add-button-container {
		margin-bottom: 1rem;
	}
	table {
		width: 100%;
		font-size: 0.875rem;
		text-align: left;
		color: #6b7280;
	}
	.dark table {
		color: #9ca3af;
	}
	thead {
		font-size: 0.75rem;
		color: #374151;
		text-transform: uppercase;
		background-color: #f9fafb;
	}
	.dark thead {
		background-color: #374151;
		color: #9ca3af;
	}
	th,
	td {
		padding: 0.75rem 1.5rem;
	}
	tr {
		background-color: #fff;
		border-bottom: 1px solid #e5e7eb;
	}
	.dark tr {
		background-color: #1f2937;
		border-color: #374151;
	}
	:global(.feed-name) {
		font-weight: 500;
		color: #111827;
		white-space: nowrap;
	}
	.dark .feed-name {
		color: #fff;
	}
	.tag-container {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}
	.feed-enabled {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
