<template>
  <header>
    <UContainer class="flex justify-between items-center py-4">
      <NuxtLink to="/" class="text-xl font-bold">RSS Discord Bot</NuxtLink>
      <nav class="flex items-center space-x-4">
        <ul class="flex space-x-4">
          <li><NuxtLink to="/feeds" active-class="text-primary">Feeds</NuxtLink></li>
          <li v-if="isAdmin"><NuxtLink to="/admin/feeds" active-class="text-primary">Admin Feeds</NuxtLink></li>
          <li v-if="isAdmin"><NuxtLink to="/admin/tags" active-class="text-primary">Admin Tags</NuxtLink></li>
        </ul>
        <div v-if="user">
          <UAvatar :src="user.user_metadata.avatar_url" :alt="user.user_metadata.full_name" size="sm" />
          <UButton
            icon="i-lucide-log-out"
            size="sm"
            color="gray"
            variant="ghost"
            label="Logout"
            @click="signOut"
          />
        </div>
        <div v-else>
          <UButton
            icon="i-lucide-log-in"
            size="sm"
            color="primary"
            variant="solid"
            label="Login"
            to="/login"
          />
        </div>
      </nav>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const { user, isAdmin } = useAuth();
const supabase = useSupabaseClient();

const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    navigateTo('/login');
  }
};
</script>
