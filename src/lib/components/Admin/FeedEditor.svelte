<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Button, Input, Checkbox, Select } from 'flowbite-svelte';
  import { z } from 'zod';
  import { supabase } from '$lib/supabaseClient';

  export let feed = null;

  const dispatch = createEventDispatcher();

  const schema = z.object({
    name: z.string().min(1, "Name is required"),
    url: z.string().url("Invalid URL").min(1, "URL is required"),
    enabled: z.boolean(),
    tags: z.array(z.string()).optional(),
  });

  let state = {
    name: feed?.name || '',
    url: feed?.url || '',
    enabled: feed?.enabled ?? true,
    tags: feed?.tags?.map((tag) => tag.id) || [],
  };

  let availableTags = [];
  onMount(async () => {
    const { data } = await supabase.from('tags').select('id, name');
    availableTags = data.map(tag => ({ value: tag.id, name: tag.name }));
  });

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
    <label for="url">URL</label>
    <Input id="url" bind:value={state.url} />
  </div>
  <div class="mb-4">
    <Checkbox bind:checked={state.enabled}>Enable Feed</Checkbox>
  </div>
  <div class="mb-4">
    <label for="tags">Tags</label>
    <Select id="tags" multiple bind:value={state.tags} items={availableTags} />
  </div>
  <div class="flex justify-end space-x-2">
    <Button type="button" color="light" on:click={() => dispatch('cancel')}>Cancel</Button>
    <Button type="submit">{feed ? 'Update' : 'Add'}</Button>
  </div>
</form>
