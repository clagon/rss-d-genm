<script lang="ts">
	import { Table, TableBody, TableHead, TableHeadCell, TableRow, TableCell, Button, Badge } from 'flowbite-svelte';
	import FeedEditor from '$lib/components/FeedEditor.svelte';

	// TODO: Replace with actual data
	let feeds = [
		{ id: '1', name: 'Google AI Blog', url: 'https://ai.googleblog.com/feeds/posts/default', tags: ['AI', 'Google'], enabled: true },
		{ id: '2', name: 'Svelte Blog', url: 'https://svelte.dev/blog/rss.xml', tags: ['Svelte', 'WebDev'], enabled: false },
	];

	let showFeedEditor = false;
	let currentFeed = { id: '', name: '', url: '', tags: [] as string[], enabled: true };

	function openNewFeedModal() {
		currentFeed = { id: '', name: '', url: '', tags: [] as string[], enabled: true };
		showFeedEditor = true;
	}

	function openEditFeedModal(feedToEdit: typeof currentFeed) {
		currentFeed = { ...feedToEdit };
		showFeedEditor = true;
	}

	function handleDeleteFeed(id: string) {
		if (confirm('Are you sure you want to delete this feed?')) {
			feeds = feeds.filter(feed => feed.id !== id);
		}
	}

	function handleSaveFeed(event: CustomEvent) {
		const savedFeed = event.detail;
		if (savedFeed.id) {
			// Update existing feed
			feeds = feeds.map(f => (f.id === savedFeed.id ? savedFeed : f));
		} else {
			// Add new feed
			savedFeed.id = String(feeds.length + 1); // Simple ID generation for mock
			feeds = [...feeds, savedFeed];
		}
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

<FeedEditor bind:open={showFeedEditor} bind:feed={currentFeed} on:save={handleSaveFeed} />
