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
		<h3>Add/Edit Tag</h3>
		<div class="form-grid">
			<div>
				<Label for="name" class="form-label">Tag Name</Label>
				<Input type="text" id="name" placeholder="Enter tag name" bind:value={tag.name} required />
			</div>
			<div>
				<Label for="channelId" class="form-label">Discord Channel ID</Label>
				<Input type="text" id="channelId" placeholder="Enter Discord Channel ID" bind:value={tag.discord_channel_id} required />
			</div>
			<div>
				<Label for="webhookUrl" class="form-label">Discord Webhook URL</Label>
				<Input type="url" id="webhookUrl" placeholder="Enter Discord Webhook URL" bind:value={tag.discord_webhook_url} required />
			</div>
		</div>
		<Button type="submit">Save Tag</Button>
	</form>
</Modal>

<style>
	h3 {
		font-size: 1.25rem;
		font-weight: 600;
		color: #1a202c;
		margin-bottom: 1rem;
	}
	.dark h3 {
		color: #fff;
	}
	.form-grid {
		display: grid;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.form-label {
		margin-bottom: 0.5rem;
	}
</style>
