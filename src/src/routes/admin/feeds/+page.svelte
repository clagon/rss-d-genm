<script lang="ts">
	import { Table, TableBody, TableHead, TableHeadCell, TableRow, TableCell, Button, Badge } from 'flowbite-svelte';

	// TODO: Replace with actual data
	const feeds = [
		{ id: '1', name: 'Google AI Blog', url: 'https://ai.googleblog.com/feeds/posts/default', tags: ['AI', 'Google'], enabled: true },
		{ id: '2', name: 'Svelte Blog', url: 'https://svelte.dev/blog/rss.xml', tags: ['Svelte', 'WebDev'], enabled: false },
	];
</script>

<h1 class="text-2xl font-bold mb-4">Admin Feeds</h1>

<div class="mb-4">
	<Button>Add New Feed</Button>
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
					<Button size="sm" class="mr-2">Edit</Button>
					<Button size="sm" color="red">Delete</Button>
				</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
