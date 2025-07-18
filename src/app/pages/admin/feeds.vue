<template>
  <div>
    <NuxtLayout name="admin">
      <h2 class="text-xl font-bold mb-4">Admin Feeds Page</h2>
      <UButton icon="i-lucide-plus" label="Add New Feed" @click="openFeedEditor" class="mb-4" />
      <AdminFeedDataTable :feeds="feeds" :pending="pending" @edit="editFeed" @delete="deleteFeed" />

      <UModal v-model="isFeedEditorOpen">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">{{ editingFeed ? 'Edit Feed' : 'Add New Feed' }}</h3>
          </template>
          <AdminFeedEditor
            :feed="editingFeed"
            @submit="handleFeedSubmit"
            @cancel="closeFeedEditor"
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

const isFeedEditorOpen = ref(false);
const editingFeed = ref(null);

const { data: feeds, pending, refresh } = useAsyncData('admin-feeds', async () => {
  const { data, error } = await supabase
    .from('feeds')
    .select('*, tags(*)');

  if (error) {
    throw new Error(error.message);
  }
  return data;
});

const openFeedEditor = () => {
  editingFeed.value = null;
  isFeedEditorOpen.value = true;
};

const closeFeedEditor = () => {
  isFeedEditorOpen.value = false;
  editingFeed.value = null;
};

const editFeed = (feed) => {
  editingFeed.value = { ...feed };
  isFeedEditorOpen.value = true;
};

const deleteFeed = async (feedId) => {
  if (confirm('Are you sure you want to delete this feed?')) {
    const { error } = await supabase
      .from('feeds')
      .delete()
      .eq('id', feedId);

    if (error) {
      alert(error.message);
    } else {
      refresh();
    }
  }
};

const handleFeedSubmit = async (feedData) => {
  if (editingFeed.value) {
    // Update existing feed
    const { error } = await supabase
      .from('feeds')
      .update({ name: feedData.name, url: feedData.url, enabled: feedData.enabled })
      .eq('id', editingFeed.value.id);

    if (error) {
      alert(error.message);
    } else {
      // Update feed_tags
      await updateFeedTags(editingFeed.value.id, feedData.tags);
      refresh();
      closeFeedEditor();
    }
  } else {
    // Add new feed
    const { data, error } = await supabase
      .from('feeds')
      .insert({ name: feedData.name, url: feedData.url, enabled: feedData.enabled })
      .select();

    if (error) {
      alert(error.message);
    } else {
      // Insert feed_tags
      if (data && data.length > 0) {
        await updateFeedTags(data[0].id, feedData.tags);
      }
      refresh();
      closeFeedEditor();
    }
  }
};

const updateFeedTags = async (feedId, tags) => {
  // Delete existing feed_tags for this feed
  await supabase.from('feed_tags').delete().eq('feed_id', feedId);

  // Insert new feed_tags
  if (tags && tags.length > 0) {
    const feedTagsToInsert = tags.map(tagId => ({ feed_id: feedId, tag_id: tagId }));
    const { error } = await supabase.from('feed_tags').insert(feedTagsToInsert);
    if (error) {
      console.error('Error updating feed tags:', error);
    }
  }
};
</script>
