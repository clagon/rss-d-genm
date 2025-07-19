<template>
  <UForm :state="state" :schema="schema" @submit="submit">
    <UFormField label="Name" name="name" class="mb-4">
      <UInput v-model="state.name" />
    </UFormField>

    <UFormField label="URL" name="url" class="mb-4">
      <UInput v-model="state.url" />
    </UFormField>

    <UFormField label="Enabled" name="enabled" class="mb-4">
      <UCheckbox v-model="state.enabled" label="Enable Feed" />
    </UFormField>

    <UFormField label="Tags" name="tags" class="mb-4">
      <USelectMenu
        v-model="state.tags"
        :items="availableTags"
        value-attribute="id"
        option-attribute="name"
        multiple
        placeholder="Select tags"
      />
    </UFormField>

    <div class="flex justify-end space-x-2">
      <UButton type="button" color="gray" variant="ghost" @click="$emit('cancel')"
        >Cancel</UButton
      >
      <UButton type="submit" @click="submit" color="primary">{{
        feed ? "Update" : "Add"
      }}</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { z } from "zod";
import { useSupabaseClient } from "#imports";

const props = defineProps({
  feed: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["submit", "cancel"]);

const supabase = useSupabaseClient();

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL").min(1, "URL is required"),
  enabled: z.boolean(),
  tags: z.array(z.string()).optional(),
});

const state = ref({
  name: props.feed?.name || "",
  url: props.feed?.url || "",
  enabled: props.feed?.enabled ?? true,
  tags: props.feed?.tags?.map((tag) => tag.id) || [],
});

const { data: availableTags } = useAsyncData("tags", async () => {
  const { data, error } = await supabase.from("tags").select("id, name");
  if (error) {
    console.error("Error fetching tags:", error.message);
    return [];
  }
  return data.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));
});

watch(
  () => props.feed,
  (newFeed) => {
    if (newFeed) {
      state.value = {
        name: newFeed.name,
        url: newFeed.url,
        enabled: newFeed.enabled,
        tags: newFeed.tags?.map((tag) => tag.id) || [],
      };
    } else {
      state.value = {
        name: "",
        url: "",
        enabled: true,
        tags: [],
      };
    }
  },
  { deep: true }
);

const submit = () => {
  console.log("Submitting feed data:", state.value);
  emit("submit", state.value);
};
</script>
