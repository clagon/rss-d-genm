<template>
  <div class="flex flex-col items-center justify-center min-h-screen py-12">
    <UCard class="w-full max-w-sm">
      <template #header>
        <h2 class="text-2xl font-bold text-center">Login</h2>
      </template>

      <div class="flex flex-col items-center space-y-4">
        <UButton
          icon="i-simple-icons-discord"
          size="lg"
          color="primary"
          variant="solid"
          label="Login with Discord"
          class="cursor-pointer"
          :loading="loading"
          @click="signInWithDiscord"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const loading = ref(false);

const signInWithDiscord = async () => {
  console.log("login");
  loading.value = true;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo: window.location.origin + "/confirm",
    },
  });
  if (error) {
    console.error(error);
    alert(error.message);
  }
  loading.value = false;
};
</script>
