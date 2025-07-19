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
		<h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Add/Edit Feed</h3>
		<div class="grid gap-4 mb-4">
			<div>
				<Label for="name" class="mb-2">Feed Name</Label>
				<Input type="text" id="name" placeholder="Enter feed name" bind:value={feed.name} required />
			</div>
			<div>
				<Label for="url" class="mb-2">Feed URL</Label>
				<Input type="url" id="url" placeholder="Enter feed URL" bind:value={feed.url} required />
			</div>
			<div>
				<Label class="mb-2">Tags</Label>
				<div class="flex flex-wrap gap-2">
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
