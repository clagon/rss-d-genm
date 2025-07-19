<template>
  <UTable :data="tags" :columns="columns" :loading="pending">
    <template #actions-cell="{ row }">
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

const emit = defineEmits(["edit", "delete"]);

const columns = [
  { accessorKey: "name", header: "Name", id: "name" },
  {
    accessorKey: "discord_channel_id",
    header: "Discord Channel ID",
    id: "discord_channel_id",
  },
  // {
  //   accessorKey: "discord_webhook_url",
  //   header: "Discord Webhook URL",
  //   id: "discord_webhook_url",
  // },
  { accessorKey: "actions", header: "Actions", id: "actions" },
];
</script>
