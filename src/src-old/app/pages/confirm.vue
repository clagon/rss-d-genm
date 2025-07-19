<template>
  <div>
    <p>Confirming login...</p>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const { auth } = useSupabaseClient();

watch(user, () => {
  if (user.value) {
    return navigateTo('/feeds');
  }
}, { immediate: true });
</script>
