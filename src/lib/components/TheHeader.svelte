<script lang="ts">
  import { page } from '$app/stores';
  import { Button, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';

  let supabase = $page.data.supabase;
  let session = $page.data.session;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">RSS Discord Bot</span>
  </NavBrand>
  <div class="flex md:order-2">
    {#if session}
      <Button on:click={handleSignOut}>Logout</Button>
    {:else}
      <Button href="/login">Login</Button>
    {/if}
    <button on:click={toggle} type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
      <span class="sr-only">Open main menu</span>
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
      </svg>
    </button>
  </div>
  <NavUl {hidden}>
    <NavLi href="/feeds">Feeds</NavLi>
    {#if $page.data.isAdmin}
      <NavLi href="/admin/feeds">Admin Feeds</NavLi>
      <NavLi href="/admin/tags">Admin Tags</NavLi>
    {/if}
  </NavUl>
</Navbar>
