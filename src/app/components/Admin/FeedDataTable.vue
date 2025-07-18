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
  { key: 'name', label: 'Name' },
  { key: 'url', label: 'URL' },
  { key: 'enabled', label: 'Enabled' },
  { key: 'tags', label: 'Tags' },
  { key: 'actions', label: 'Actions' },
];
</script>
