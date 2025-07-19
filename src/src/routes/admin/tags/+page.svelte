<script lang="ts">
	import { Table, TableBody, TableHead, TableHeadCell, TableRow, TableCell, Button } from 'flowbite-svelte';

	// TODO: Replace with actual data
	const tags = [
		{ id: '1', name: 'AI', discord_channel_id: '1234567890', discord_webhook_url: 'https://discord.com/api/webhooks/...' },
		{ id: '2', name: 'WebDev', discord_channel_id: '0987654321', discord_webhook_url: 'https://discord.com/api/webhooks/...' },
	];
</script>

<h1 class="text-2xl font-bold mb-4">Admin Tags</h1>

<div class="mb-4">
	<Button>Add New Tag</Button>
</div>

<Table>
	<TableHead>
		<TableHeadCell>Tag Name</TableHeadCell>
		<TableHeadCell>Discord Channel ID</TableHeadCell>
		<TableHeadCell>Actions</TableHeadCell>
	</TableHead>
	<TableBody>
		{#each tags as tag}
			<TableRow>
				<TableCell>{tag.name}</TableCell>
				<TableCell>{tag.discord_channel_id}</TableCell>
				<TableCell>
					<Button size="sm" class="mr-2">Edit</Button>
					<Button size="sm" color="red">Delete</Button>
				</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>
