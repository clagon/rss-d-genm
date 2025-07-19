<script lang="ts">
  import { onMount } from 'svelte';
  import { Button, Modal, Card, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import type { PageData } from './$types';
  import TagEditor from '$lib/components/Admin/TagEditor.svelte';

  export let data: PageData;

  let tags = data.tags || [];
  let isTagEditorOpen = false;
  let editingTag = null;

  const openTagEditor = () => {
    editingTag = null;
    isTagEditorOpen = true;
  };

  const editTag = (tag) => {
    editingTag = { ...tag };
    isTagEditorOpen = true;
  };

  const deleteTag = async (tagId) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      const response = await fetch(`/api/tags/${tagId}`, { method: 'DELETE' });
      if (response.ok) {
        tags = tags.filter(t => t.id !== tagId);
      } else {
        alert('Error deleting tag');
      }
    }
  };

  const handleTagSubmit = async (event) => {
    const tagData = event.detail;
    const url = editingTag ? `/api/tags/${editingTag.id}` : '/api/tags';
    const method = editingTag ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tagData),
    });

    if (response.ok) {
      isTagEditorOpen = false;
      const updatedTag = await response.json();
      if (editingTag) {
        const index = tags.findIndex(t => t.id === editingTag.id);
        tags[index] = updatedTag;
      } else {
        tags = [...tags, updatedTag];
      }
    } else {
      alert('Error saving tag');
    }
  };
</script>

<div class="container mx-auto p-4">
  <h2 class="text-xl font-bold mb-4">Admin Tags Page</h2>
  <Button on:click={openTagEditor}>Add New Tag</Button>

  <Table>
    <TableHead>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Discord Channel ID</TableHeadCell>
      <TableHeadCell>Actions</TableHeadCell>
    </TableHead>
    <TableBody>
      {#each tags as tag (tag.id)}
        <TableBodyRow>
          <TableBodyCell>{tag.name}</TableBodyCell>
          <TableBodyCell>{tag.discord_channel_id}</TableBodyCell>
          <TableBodyCell>
            <Button on:click={() => editTag(tag)}>Edit</Button>
            <Button color="red" on:click={() => deleteTag(tag.id)}>Delete</Button>
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>

  <Modal bind:open={isTagEditorOpen}>
    <Card>
      <h3 class="text-lg font-semibold">{editingTag ? 'Edit Tag' : 'Add New Tag'}</h3>
      <TagEditor tag={editingTag} on:submit={handleTagSubmit} on:cancel={() => isTagEditorOpen = false} />
    </Card>
  </Modal>
</div>
