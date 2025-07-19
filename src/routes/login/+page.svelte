<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { Button } from 'flowbite-svelte';

  async function signInWithDiscord() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
    });
    if (error) {
      console.error('Error signing in with Discord:', error.message);
    }
  }
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
  <div class="w-full max-w-sm p-8 space-y-4 bg-white rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-center">Login</h2>
    <Button on:click={signInWithDiscord} class="w-full">
      Login with Discord
    </Button>
  </div>
</div>
