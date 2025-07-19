<script lang="ts">
	import { Modal, Button, Label, Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let open = false;
	export let tag = { id: '', name: '', discord_channel_id: '', discord_webhook_url: '' };

	function handleSubmit() {
		dispatch('save', tag);
		open = false;
	}
</script>

<Modal bind:open={open} size="lg" autoclose>
	<form on:submit|preventDefault={handleSubmit}>
		<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add/Edit Tag</h3>
		<div class="grid gap-4 mb-4">
			<div>
				<Label for="name" class="mb-2">Tag Name</Label>
				<Input type="text" id="name" placeholder="Enter tag name" bind:value={tag.name} required />
			</div>
			<div>
				<Label for="channelId" class="mb-2">Discord Channel ID</Label>
				<Input type="text" id="channelId" placeholder="Enter Discord Channel ID" bind:value={tag.discord_channel_id} required />
			</div>
			<div>
				<Label for="webhookUrl" class="mb-2">Discord Webhook URL</Label>
				<Input type="url" id="webhookUrl" placeholder="Enter Discord Webhook URL" bind:value={tag.discord_webhook_url} required />
			</div>
		</div>
		<Button type="submit">Save Tag</Button>
	</form>
</Modal>
