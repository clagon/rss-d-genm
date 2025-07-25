<script lang="ts">
	import { page } from '$app/state';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
	import { supabase } from '$lib/supabaseClient';
	import type { User } from '@supabase/supabase-js';

	let activeUrl = $derived(page.url.pathname);
	let { data } = $derived(page);
	let { session } = $derived(data);
	// let { user } = $derived(data);
	let user: User | null = $state(null);
	supabase.auth.getUser().then(({ data }) => {
		user = data.user;
	});
	console.log(page);
</script>

<Navbar fluid={true}>
	<NavBrand href="/">
		<span class="nowrap self-center text-xl font-bold dark:text-white">RSS-D-GENM{session}</span>
	</NavBrand>
	<div class="flex md:order-2">
		{#if user}
			<form action="/auth/logout" method="post">
				<Button type="submit">Sign Out</Button>
			</form>
		{:else}
			<a href="/login">
				<Button>Sign In</Button>
			</a>
		{/if}
		<NavHamburger />
	</div>
	<NavUl {activeUrl}>
		<NavLi href="/">Feeds</NavLi>

		{#if user}
			<NavLi href="/admin/feeds">Admin Feeds</NavLi>
			<NavLi href="/admin/tags">Admin Tags</NavLi>
		{/if}
	</NavUl>
</Navbar>
