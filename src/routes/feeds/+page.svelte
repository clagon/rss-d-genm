<script lang="ts">
  import { onMount } from 'svelte';
  import { Card, Badge, Input } from 'flowbite-svelte';
  import type { PageData } from './$types';

  export let data: PageData;

  let feeds = data.feeds || [];
  let searchQuery = '';

  $: filteredFeeds = feeds.filter(feed => {
    if (!searchQuery) return true;
    return feed.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()));
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">RSS Feeds</h1>
  <div class="mb-4">
    <Input type="text" bind:value={searchQuery} placeholder="Search by tag..." />
  </div>

  {#if filteredFeeds.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each filteredFeeds as feed (feed.id)}
        <Card>
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{feed.name}</h5>
          <p class="font-normal text-gray-700 dark:text-gray-400 leading-tight">{feed.url}</p>
          <div class="mt-2">
            {#each feed.tags as tag (tag.id)}
              <Badge class="mr-1 mb-1">{tag.name}</Badge>
            {/each}
          </div>
        </Card>
      {/each}
    </div>
  {:else}
    <p>No feeds found.</p>
  {/if}
</div>
