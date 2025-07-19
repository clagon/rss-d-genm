<template>
  {{ feeds }}
  <UTable :data="feeds" :columns="columns" :loading="pending">
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
    <template #enabled-data="{ row }">
      <UBadge
        :color="row.enabled ? 'green' : 'red'"
        :label="row.enabled ? 'Enabled' : 'Disabled'"
      />
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

const emit = defineEmits(["edit", "delete"]);

const columns = [
  { accessorKey: "name", label: "Name", id: "name" },
  { accessorKey: "url", label: "URL", id: "url" },
  { accessorKey: "enabled", label: "Enabled", id: "enabled" },
  {
    accessorKey: "tags",
    label: "Tags",
    id: "tags",
    cell: ({ row }) => Array.from(row.getValue("tags"))[0]?.name || "No Tags",
  },
  { accessorKey: "actions", label: "Actions", id: "actions" },
];
</script>
