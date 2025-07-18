<template>
  <UForm :state="state" :schema="schema" @submit="submit">
    <UFormGroup label="Name" name="name" class="mb-4">
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup label="Discord Channel ID" name="discord_channel_id" class="mb-4">
      <UInput v-model="state.discord_channel_id" />
    </UFormGroup>

    <UFormGroup label="Discord Webhook URL" name="discord_webhook_url" class="mb-4">
      <UInput v-model="state.discord_webhook_url" />
    </UFormGroup>

    <div class="flex justify-end space-x-2">
      <UButton type="button" color="gray" variant="ghost" @click="$emit('cancel')">Cancel</UButton>
      <UButton type="submit" color="primary">{{ tag ? 'Update' : 'Add' }}</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { z } from 'zod';

const props = defineProps({
  tag: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  discord_channel_id: z.string().optional(),
  discord_webhook_url: z.string().url('Invalid URL').min(1, 'Webhook URL is required'),
});

const state = ref({
  name: props.tag?.name || '',
  discord_channel_id: props.tag?.discord_channel_id || '',
  discord_webhook_url: props.tag?.discord_webhook_url || '',
});

watch(() => props.tag, (newTag) => {
  if (newTag) {
    state.value = {
      name: newTag.name,
      discord_channel_id: newTag.discord_channel_id,
      discord_webhook_url: newTag.discord_webhook_url,
    };
  } else {
    state.value = {
      name: '',
      discord_channel_id: '',
      discord_webhook_url: '',
    };
  }
}, { deep: true });

const submit = () => {
  emit('submit', state.value);
};
</script>
