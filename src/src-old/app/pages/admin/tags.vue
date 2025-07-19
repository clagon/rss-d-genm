<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Admin Tags Page {{ isTagEditorOpen }}</h2>
    <UButton
      icon="i-lucide-plus"
      label="Add New Tag"
      class="mb-4"
      @click="openTagEditor"
    />
    <AdminTagDataTable
      :tags="tags"
      :pending="pending"
      @edit="editTag"
      @delete="deleteTag"
    />

    <UModal :open="isTagEditorOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">
              {{ editingTag ? "Edit Tag" : "Add New Tag" }}
            </h3>
          </template>
          <AdminTagEditor
            :tag="editingTag"
            @submit="handleTagSubmit"
            @cancel="closeTagEditor"
          />
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useSupabaseClient } from "#imports";

definePageMeta({
  layout: "admin",
});

const supabase = useSupabaseClient();
const toast = useToast();

const isTagEditorOpen = ref(false);
const editingTag = ref(null);

const { data: tags, pending, refresh } = useAsyncData("admin-tags", async () => {
  const { data, error } = await supabase.from("tags").select("*");
  console.log(data);
  if (error) {
    toast.add({ title: "Error", description: error.message, color: "red" });
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
  if (confirm("Are you sure you want to delete this tag?")) {
    const { error } = await supabase.from("tags").delete().eq("id", tagId);

    if (error) {
      toast.add({ title: "Error", description: error.message, color: "red" });
    } else {
      toast.add({
        title: "Success",
        description: "Tag deleted successfully.",
        color: "green",
      });
      refresh();
    }
  }
};

const handleTagSubmit = async (tagData) => {
  if (editingTag.value) {
    // Update existing tag
    const { error } = await supabase
      .from("tags")
      .update({
        name: tagData.name,
        discord_channel_id: tagData.discord_channel_id,
        discord_webhook_url: tagData.discord_webhook_url,
      })
      .eq("id", editingTag.value.id);

    if (error) {
      toast.add({ title: "Error", description: error.message, color: "red" });
    } else {
      toast.add({
        title: "Success",
        description: "Tag updated successfully.",
        color: "green",
      });
      refresh();
      closeTagEditor();
    }
  } else {
    // Add new tag
    const { error } = await supabase.from("tags").insert({
      name: tagData.name,
      discord_channel_id: tagData.discord_channel_id,
      discord_webhook_url: tagData.discord_webhook_url,
    });

    if (error) {
      toast.add({ title: "Error", description: error.message, color: "red" });
    } else {
      toast.add({
        title: "Success",
        description: "Tag added successfully.",
        color: "green",
      });
      refresh();
      closeTagEditor();
    }
  }
};
</script>
