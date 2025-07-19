<script lang="ts">
	import { Table, TableBody, TableHead, TableHeadCell, TableRow, TableCell, Button, Badge } from 'flowbite-svelte';
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

	let feeds: Feed[] = [];
	let availableTags: Tag[] = [];
	let showFeedEditor = false;
	let currentFeed: Feed = { id: '', name: '', url: '', tags: [] as string[], enabled: true };

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

<h1 class="text-2xl font-bold mb-4">Admin Feeds</h1>

<div class="mb-4">
	<Button on:click={openNewFeedModal}>Add New Feed</Button>
</div>

<Table>
	<TableHead>
		<TableHeadCell>Feed Name</TableHeadCell>
		<TableHeadCell>URL</TableHeadCell>
		<TableHeadCell>Tags</TableHeadCell>
		<TableHeadCell>Enabled</TableHeadCell>
		<TableHeadCell>Actions</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each feeds as feed}
			<TableRow>
				<TableCell>{feed.name}</TableCell>
				<TableCell>{feed.url}</TableCell>
				<TableCell>
					{#each feed.tags as tag}
						<Badge>{tag}</Badge>
					{/each}
				</TableCell>
				<TableCell>{feed.enabled ? 'Yes' : 'No'}</TableCell>
				<TableCell>
					<Button size="sm" class="mr-2" on:click={() => openEditFeedModal(feed)}>Edit</Button>
					<Button size="sm" color="red" on:click={() => handleDeleteFeed(feed.id)}>Delete</Button>
				</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>

<FeedEditor bind:open={showFeedEditor} bind:feed={currentFeed} availableTags={availableTags.map(t => t.name)} on:save={handleSaveFeed} />
