<template>
  <UContainer>
    <h1 class="text-2xl font-bold mb-4">RSS Feeds</h1>
    <div v-if="pending">Loading feeds...</div>
    <div v-else-if="error">Error loading feeds: {{ error.message }}</div>
    <div v-else-if="feeds && feeds.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard v-for="feed in feeds" :key="feed.id">
          <template #header>
            <h3 class="text-lg font-semibold">{{ feed.name }}</h3>
          </template>
          <p class="text-sm text-gray-500">{{ feed.url }}</p>
          <div class="mt-2">
            <UBadge
              v-for="tag in feed.tags"
              :key="tag.id"
              :label="tag.name"
              color="primary"
              variant="subtle"
              class="mr-1 mb-1"
            />
          </div>
        </UCard>
      </div>
    </div>
    <div v-else>
      <p>No feeds found.</p>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
import { useSupabaseClient } from '#imports';

const supabase = useSupabaseClient();

const { data: feeds, pending, error } = useAsyncData('feeds', async () => {
  const { data, error } = await supabase
    .from('feeds')
    .select('*, tags(*)') // tagsテーブルも結合して取得
    .eq('enabled', true);

  if (error) {
    throw new Error(error.message);
  }
  return data;
});
</script>
