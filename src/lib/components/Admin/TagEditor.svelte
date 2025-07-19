<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Input } from 'flowbite-svelte';
  import { z } from 'zod';

  export let tag = null;

  const dispatch = createEventDispatcher();

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    discord_channel_id: z.string().optional(),
    discord_webhook_url: z.string().url("Invalid URL").min(1, "Webhook URL is required"),
  });

  let state = {
    name: tag?.name || '',
    discord_channel_id: tag?.discord_channel_id || '',
    discord_webhook_url: tag?.discord_webhook_url || '',
  };

  const submit = () => {
    dispatch('submit', state);
  };
</script>

<form on:submit|preventDefault={submit}>
  <div class="mb-4">
    <label for="name">Name</label>
    <Input id="name" bind:value={state.name} />
  </div>
  <div class="mb-4">
    <label for="discord_channel_id">Discord Channel ID</label>
    <Input id="discord_channel_id" bind:value={state.discord_channel_id} />
  </div>
  <div class="mb-4">
    <label for="discord_webhook_url">Discord Webhook URL</label>
    <Input id="discord_webhook_url" bind:value={state.discord_webhook_url} />
  </div>
  <div class="flex justify-end space-x-2">
    <Button type="button" color="light" on:click={() => dispatch('cancel')}>Cancel</Button>
    <Button type="submit">{tag ? 'Update' : 'Add'}</Button>
  </div>
</form>
