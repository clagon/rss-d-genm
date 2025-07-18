<template>
  <div>
    <NuxtLayout name="admin">
      <h2 class="text-xl font-bold mb-4">Admin Tags Page</h2>
      <UButton icon="i-lucide-plus" label="Add New Tag" @click="openTagEditor" class="mb-4" />
      <AdminTagDataTable :tags="tags" :pending="pending" @edit="editTag" @delete="deleteTag" />

      <UModal v-model="isTagEditorOpen">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">{{ editingTag ? 'Edit Tag' : 'Add New Tag' }}</h3>
          </template>
          <AdminTagEditor
            :tag="editingTag"
            @submit="handleTagSubmit"
            @cancel="closeTagEditor"
          />
        </UCard>
      </UModal>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();

const isTagEditorOpen = ref(false);
const editingTag = ref(null);

const { data: tags, pending, refresh } = useAsyncData('admin-tags', async () => {
  const { data, error } = await supabase
    .from('tags')
    .select('*');

  if (error) {
    throw new Error(error.message);
  }
  return data;
});

const openTagEditor = () => {
  editingTag.value = null;
  isTagEditorOpen.value = true;
};

const closeTagEditor = () => {
  isTagEditorOpen.value = false;
  editingTag.value = null;
};

const editTag = (tag) => {
  editingTag.value = { ...tag };
  isTagEditorOpen.value = true;
};

const deleteTag = async (tagId) => {
  if (confirm('Are you sure you want to delete this tag?')) {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', tagId);

    if (error) {
      alert(error.message);
    } else {
      refresh();
    }
  }
};

const handleTagSubmit = async (tagData) => {
  if (editingTag.value) {
    // Update existing tag
    const { error } = await supabase
      .from('tags')
      .update({ name: tagData.name, discord_channel_id: tagData.discord_channel_id, discord_webhook_url: tagData.discord_webhook_url })
      .eq('id', editingTag.value.id);

    if (error) {
      alert(error.message);
    } else {
      refresh();
      closeTagEditor();
    }
  } else {
    // Add new tag
    const { error } = await supabase
      .from('tags')
      .insert({ name: tagData.name, discord_channel_id: tagData.discord_channel_id, discord_webhook_url: tagData.discord_webhook_url });

    if (error) {
      alert(error.message);
    } else {
      refresh();
      closeTagEditor();
    }
  }
};
</script>
