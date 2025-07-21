<script lang="ts">
	import { Button } from 'flowbite-svelte';
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

<h1>Admin Tags</h1>

<div class="add-button-container">
	<Button onclick={openNewTagModal}>Add New Tag</Button>
</div>

<table>
	<thead>
		<tr>
			<th>Tag Name</th>
			<th>Discord Channel ID</th>
			<th>Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each tags as tag}
			<tr>
				<td class="tag-name">{tag.name}</td>
				<td>{tag.discord_channel_id}</td>
				<td>
					<Button size="sm" class="mr-2" onclick={() => openEditTagModal(tag)}>Edit</Button>
					<Button size="sm" color="red" onclick={() => handleDeleteTag(tag.id)}>Delete</Button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<TagEditor bind:open={showTagEditor} bind:tag={currentTag} on:save={handleSaveTag} />

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
	th, td {
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
	.tag-name {
		font-weight: 500;
		color: #111827;
		white-space: nowrap;
	}
	.dark .tag-name {
		color: #fff;
	}
</style>