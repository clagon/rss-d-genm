<script lang="ts">
	import { Table, TableBody, TableHead, TableHeadCell, TableRow, TableCell, Button } from 'flowbite-svelte';
	import TagEditor from '$lib/components/TagEditor.svelte';

	// TODO: Replace with actual data
	let tags = [
		{ id: '1', name: 'AI', discord_channel_id: '1234567890', discord_webhook_url: 'https://discord.com/api/webhooks/...' },
		{ id: '2', name: 'WebDev', discord_channel_id: '0987654321', discord_webhook_url: 'https://discord.com/api/webhooks/...' },
	];

	let showTagEditor = false;
	let currentTag = { id: '', name: '', discord_channel_id: '', discord_webhook_url: '' };

	function openNewTagModal() {
		currentTag = { id: '', name: '', discord_channel_id: '', discord_webhook_url: '' };
		showTagEditor = true;
	}

	function handleSaveTag(event: CustomEvent) {
		const savedTag = event.detail;
		if (savedTag.id) {
			// Update existing tag
			tags = tags.map(t => (t.id === savedTag.id ? savedTag : t));
		} else {
			// Add new tag
			savedTag.id = String(tags.length + 1); // Simple ID generation for mock
			tags = [...tags, savedTag];
		}
		showTagEditor = false;
	}
</script>

<h1 class="text-2xl font-bold mb-4">Admin Tags</h1>

<div class="mb-4">
	<Button on:click={openNewTagModal}>Add New Tag</Button>
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

<TagEditor bind:open={showTagEditor} bind:tag={currentTag} on:save={handleSaveTag} />
