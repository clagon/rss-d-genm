<script lang="ts">
	import { Table, TableBody, TableHead, TableHeadCell, TableRow, TableCell, Button } from 'flowbite-svelte';
	import TagEditor from '$lib/components/TagEditor.svelte';
	import * as tagApi from '$lib/api/tags';
	import { onMount } from 'svelte';

	interface Tag {
		id: string;
		name: string;
		discord_channel_id: string;
		discord_webhook_url: string;
	}

	let tags: Tag[] = [];
	let showTagEditor = false;
	let currentTag: Tag = { id: '', name: '', discord_channel_id: '', discord_webhook_url: '' };

	onMount(async () => {
		tags = await tagApi.getAllTags();
	});

	function openNewTagModal() {
		currentTag = { id: '', name: '', discord_channel_id: '', discord_webhook_url: '' };
		showTagEditor = true;
	}

	function openEditTagModal(tagToEdit: Tag) {
		currentTag = { ...tagToEdit };
		showTagEditor = true;
	}

	async function handleDeleteTag(id: string) {
		if (confirm('Are you sure you want to delete this tag?')) {
			await tagApi.deleteTag(id);
			tags = await tagApi.getAllTags(); // Refresh list
		}
	}

	async function handleSaveTag(event: CustomEvent) {
		const savedTag = event.detail;
		if (savedTag.id) {
			await tagApi.updateTag(savedTag);
		} else {
			await tagApi.createTag(savedTag);
		}
		tags = await tagApi.getAllTags(); // Refresh list
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
					<Button size="sm" class="mr-2" on:click={() => openEditTagModal(tag)}>Edit</Button>
					<Button size="sm" color="red" on:click={() => handleDeleteTag(tag.id)}>Delete</Button>
				</TableCell>
			</TableRow>
		{/each}
	</TableBody>
</Table>

<TagEditor bind:open={showTagEditor} bind:tag={currentTag} on:save={handleSaveTag} />