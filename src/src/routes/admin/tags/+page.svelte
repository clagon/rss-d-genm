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

<h1 class="text-2xl font-bold mb-4">Admin Tags</h1>

<div class="mb-4">
	<Button on:click={openNewTagModal}>Add New Tag</Button>
</div>

<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
	<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
		<tr>
			<th scope="col" class="px-6 py-3">Tag Name</th>
			<th scope="col" class="px-6 py-3">Discord Channel ID</th>
			<th scope="col" class="px-6 py-3">Actions</th>
		</tr>
	</thead>
	<tbody>
		{#each tags as tag}
			<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
				<td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{tag.name}</td>
				<td class="px-6 py-4">{tag.discord_channel_id}</td>
				<td class="px-6 py-4">
					<Button size="sm" class="mr-2" on:click={() => openEditTagModal(tag)}>Edit</Button>
					<Button size="sm" color="red" on:click={() => handleDeleteTag(tag.id)}>Delete</Button>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

<TagEditor bind:open={showTagEditor} bind:tag={currentTag} on:save={handleSaveTag} />