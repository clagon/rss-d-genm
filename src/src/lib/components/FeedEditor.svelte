<script lang="ts">
	import { Modal, Button, Label, Input, Checkbox } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let open = false;
	export let feed = { id: '', name: '', url: '', tags: [] as string[], enabled: true };
	export let availableTags: string[] = [];

	function handleSubmit() {
		dispatch('save', feed);
		open = false;
	}
</script>

<Modal bind:open={open} size="lg" autoclose>
	<form on:submit|preventDefault={handleSubmit}>
		<h3>Add/Edit Feed</h3>
		<div class="form-grid">
			<div>
				<Label for="name" class="form-label">Feed Name</Label>
				<Input type="text" id="name" placeholder="Enter feed name" bind:value={feed.name} required />
			</div>
			<div>
				<Label for="url" class="form-label">Feed URL</Label>
				<Input type="url" id="url" placeholder="Enter feed URL" bind:value={feed.url} required />
			</div>
			<div>
				<Label class="form-label">Tags</Label>
				<div class="tag-container">
					{#each availableTags as tagOption}
						<Checkbox bind:group={feed.tags} value={tagOption}>{tagOption}</Checkbox>
					{/each}
				</div>
			</div>
			<div>
				<Checkbox bind:checked={feed.enabled}>Enabled</Checkbox>
			</div>
		</div>
		<Button type="submit">Save Feed</Button>
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
	.tag-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
