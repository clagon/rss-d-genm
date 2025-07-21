<script lang="ts">
	import { page } from '$app/state';
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	let activeUrl = $derived(page.url.pathname);
</script>

<Navbar fluid={true}>
	<NavBrand href="/">
		<span class="nowrap self-center text-xl font-bold dark:text-white">RSS-D-GENM</span>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl}>
		<NavLi href="/">Feeds</NavLi>
		<NavLi href="/admin/feeds">Admin Feeds</NavLi>
		<NavLi href="/admin/tags">Admin Tags</NavLi>
	</NavUl>
</Navbar>
