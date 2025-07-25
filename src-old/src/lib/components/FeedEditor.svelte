<script lang="ts">
	import { Modal, Button, Label, Input, Checkbox, Toggle } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let {
		open = $bindable(false),
		feed = $bindable({
			id: '',
			name: '',
			url: '',
			tags: [] as string[],
			enabled: true
		}),
		availableTags = $bindable([])
	} = $props();

	let choices = $derived(
		availableTags.map((tag) => ({
			value: tag,
			label: tag
		}))
	);

	function handleSubmit(event: Event) {
		event.preventDefault();
		dispatch('save', feed);
		open = false;
	}
</script>

<Modal bind:open size="lg" autoclose outsideclose={false} focustrap={true}>
	<form onsubmit={handleSubmit}>
		<h3>Add/Edit Feed</h3>
		<div class="form-grid">
			<div>
				<Label for="name" class="form-label">Feed Name</Label>
				<Input
					type="text"
					id="name"
					placeholder="Enter feed name"
					bind:value={feed.name}
					required
				/>
			</div>
			<div>
				<Label for="url" class="form-label">Feed URL</Label>
				<Input type="url" id="url" placeholder="Enter feed URL" bind:value={feed.url} required />
			</div>
			<div>
				<Label>Tags</Label>
				<div class="tag-container">
					<Checkbox bind:group={feed.tags} {choices} name="tags" />
				</div>
			</div>
			<div>
				<Toggle bind:checked={feed.enabled}>{feed.enabled ? 'Enabled' : 'Disabled'}</Toggle>
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
	.tag-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
</style>
