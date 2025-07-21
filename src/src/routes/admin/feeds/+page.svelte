<script lang="ts">
	import { Button, Badge } from 'flowbite-svelte';
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

<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
	<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
		<tr>
			<th scope="col" class="px-6 py-3">Feed Name</th>
			<th scope="col" class="px-6 py-3">URL</th>
			<th scope="col" class="px-6 py-3">Tags</th>
			<th scope="col" class="px-6 py-3">Enabled</th>
			<th scope="col" class="px-6 py-3">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each feeds as feed}
			<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
				<td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{feed.name}</td>
				<td class="px-6 py-4">{feed.url}</td>
				<td class="px-6 py-4">
					{#each feed.tags as tag}
						<Badge>{tag}</Badge>
					{/each}
				</td>
				<td class="px-6 py-4">{feed.enabled ? 'Yes' : 'No'}</td>
				<td class="px-6 py-4">
					<Button size="sm" class="mr-2" on:click={() => openEditFeedModal(feed)}>Edit</Button>
					<Button size="sm" color="red" on:click={() => handleDeleteFeed(feed.id)}>Delete</Button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<FeedEditor bind:open={showFeedEditor} bind:feed={currentFeed} availableTags={availableTags.map(t => t.name)} on:save={handleSaveFeed} />
