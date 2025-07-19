<template>
  <UTable :rows="feeds" :columns="columns" :loading="pending">
    <template #actions-data="{ row }">
      <UButton
        icon="i-lucide-edit"
        size="sm"
        color="primary"
        variant="ghost"
        @click="$emit('edit', row)"
      />
      <UButton
        icon="i-lucide-trash"
        size="sm"
        color="red"
        variant="ghost"
        @click="$emit('delete', row.id)"
      />
    </template>
    <template #enabled-data="{ row }">
      <UBadge :color="row.enabled ? 'green' : 'red'" :label="row.enabled ? 'Enabled' : 'Disabled'" />
    </template>
    <template #tags-data="{ row }">
      <UBadge
        v-for="tag in row.tags"
        :key="tag.id"
        :label="tag.name"
        color="blue"
        variant="subtle"
        class="mr-1 mb-1"
      />
    </template>
  </UTable>
</template>

<script setup lang="ts">
const props = defineProps({
  feeds: {
    type: Array,
    default: () => [],
  },
  pending: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['edit', 'delete']);

const columns = [
  { key: 'name', label: 'Name', id: 'name' },
  { key: 'url', label: 'URL', id: 'url' },
  { key: 'enabled', label: 'Enabled', id: 'enabled' },
  { key: 'tags', label: 'Tags', id: 'tags' },
  { key: 'actions', label: 'Actions', id: 'actions' },
];
</script>
