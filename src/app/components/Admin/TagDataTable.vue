<template>
  <UTable :rows="tags" :columns="columns" :loading="pending">
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
  </UTable>
</template>

<script setup lang="ts">
const props = defineProps({
  tags: {
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
  { key: 'discord_channel_id', label: 'Discord Channel ID' },
  { key: 'discord_webhook_url', label: 'Discord Webhook URL' },
  { key: 'actions', label: 'Actions' },
];
</script>
