<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, Modal, Card, Badge, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import type { PageData } from './$types';
  import FeedEditor from '$lib/components/Admin/FeedEditor.svelte';

  export let data: PageData;

  let feeds = data.feeds || [];
  let isFeedEditorOpen = false;
  let editingFeed = null;

  const openFeedEditor = () => {
    editingFeed = null;
    isFeedEditorOpen = true;
  };

  const editFeed = (feed) => {
    editingFeed = { ...feed };
    isFeedEditorOpen = true;
  };

  const deleteFeed = async (feedId) => {
    if (confirm('Are you sure you want to delete this feed?')) {
      const response = await fetch(`/api/feeds/${feedId}`, { method: 'DELETE' });
      if (response.ok) {
        feeds = feeds.filter(f => f.id !== feedId);
      } else {
        alert('Error deleting feed');
      }
    }
  };

  const handleFeedSubmit = async (event) => {
    const feedData = event.detail;
    const url = editingFeed ? `/api/feeds/${editingFeed.id}` : '/api/feeds';
    const method = editingFeed ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedData),
    });

    if (response.ok) {
      isFeedEditorOpen = false;
      const updatedFeed = await response.json();
      if (editingFeed) {
        const index = feeds.findIndex(f => f.id === editingFeed.id);
        feeds[index] = updatedFeed;
      } else {
        feeds = [...feeds, updatedFeed];
      }
    } else {
      alert('Error saving feed');
    }
  };
</script>

<div class="container mx-auto p-4">
  <h2 class="text-xl font-bold mb-4">Admin Feeds Page</h2>
  <Button on:click={openFeedEditor}>Add New Feed</Button>

  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>URL</TableHeadCell>
      <TableHeadCell>Enabled</TableHeadCell>
      <TableHeadCell>Tags</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each feeds as feed (feed.id)}
        <TableBodyRow>
          <TableBodyCell>{feed.name}</TableBodyCell>
          <TableBodyCell>{feed.url}</TableBodyCell>
          <TableBodyCell>
            <Badge color={feed.enabled ? 'green' : 'red'}>{feed.enabled ? 'Enabled' : 'Disabled'}</Badge>
          </TableBodyCell>
          <TableBodyCell>
            {#each feed.tags as tag (tag.id)}
              <Badge class="mr-1 mb-1">{tag.name}</Badge>
            {/each}
          </TableBodyCell>
          <TableBodyCell>
            <Button on:click={() => editFeed(feed)}>Edit</Button>
            <Button color="red" on:click={() => deleteFeed(feed.id)}>Delete</Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <Modal bind:open={isFeedEditorOpen}>
    <Card>
      <h3 class="text-lg font-semibold">{editingFeed ? 'Edit Feed' : 'Add New Feed'}</h3>
      <FeedEditor feed={editingFeed} on:submit={handleFeedSubmit} on:cancel={() => isFeedEditorOpen = false} />
    </Card>
  </Modal>
</div>
