<template>
  <div>
    <NuxtLayout name="admin">
      <h2 class="text-xl font-bold mb-4">Admin Feeds Page</h2>
      <UButton
        icon="i-lucide-plus"
        label="Add New Feed"
        class="mb-4"
        @click="openFeedEditor"
      />
      <AdminFeedDataTable
        :feeds="feeds"
        :pending="pending"
        @edit="editFeed"
        @delete="deleteFeed"
      />

      <UModal v-model="isFeedEditorOpen">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              {{ editingFeed ? "Edit Feed" : "Add New Feed" }}
            </h3>
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
import { useSupabaseClient } from "#imports";

const supabase = useSupabaseClient();
const toast = useToast();

const isFeedEditorOpen = ref(false);
const editingFeed = ref(null);

const { data: feeds, pending, refresh } = useAsyncData("admin-feeds", async () => {
  const { data, error } = await supabase.from("feeds").select("*, tags(*)");

  if (error) {
    toast.add({ title: "Error", description: error.message, color: "red" });
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
  if (confirm("Are you sure you want to delete this feed?")) {
    const { error } = await supabase.from("feeds").delete().eq("id", feedId);

    if (error) {
      toast.add({ title: "Error", description: error.message, color: "red" });
    } else {
      toast.add({
        title: "Success",
        description: "Feed deleted successfully.",
        color: "green",
      });
      refresh();
    }
  }
};

const handleFeedSubmit = async (feedData) => {
  if (editingFeed.value) {
    // Update existing feed
    const { error } = await supabase
      .from("feeds")
      .update({ name: feedData.name, url: feedData.url, enabled: feedData.enabled })
      .eq("id", editingFeed.value.id);

    if (error) {
      toast.add({ title: "Error", description: error.message, color: "red" });
    } else {
      // Update feed_tags
      await updateFeedTags(editingFeed.value.id, feedData.tags);
      toast.add({
        title: "Success",
        description: "Feed updated successfully.",
        color: "green",
      });
      refresh();
      closeFeedEditor();
    }
  } else {
    // Add new feed
    const { data, error } = await supabase
      .from("feeds")
      .insert({ name: feedData.name, url: feedData.url, enabled: feedData.enabled })
      .select();

    if (error) {
      toast.add({ title: "Error", description: error.message, color: "red" });
    } else {
      // Insert feed_tags
      if (data && data.length > 0) {
        await updateFeedTags(data[0].id, feedData.tags);
      }
      toast.add({
        title: "Success",
        description: "Feed added successfully.",
        color: "green",
      });
      refresh();
      closeFeedEditor();
    }
  }
};

const updateFeedTags = async (feedId, tags) => {
  // Delete existing feed_tags for this feed
  const { error: deleteError } = await supabase
    .from("feed_tags")
    .delete()
    .eq("feed_id", feedId);
  if (deleteError) {
    console.error("Error deleting old feed tags:", deleteError);
    toast.add({ title: "Error", description: deleteError.message, color: "red" });
    return;
  }

  // Insert new feed_tags
  if (tags && tags.length > 0) {
    const feedTagsToInsert = tags.map((tagId) => ({ feed_id: feedId, tag_id: tagId }));
    const { error: insertError } = await supabase
      .from("feed_tags")
      .insert(feedTagsToInsert);
    if (insertError) {
      console.error("Error inserting new feed tags:", insertError);
      toast.add({ title: "Error", description: insertError.message, color: "red" });
    }
  }
};
</script>
