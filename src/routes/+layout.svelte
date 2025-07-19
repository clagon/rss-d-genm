<script lang="ts">
  import TheHeader from '$lib/components/TheHeader.svelte';
  import "../app.css";
</script>

<TheHeader />

<main class="p-4">
  <slot />
</main>