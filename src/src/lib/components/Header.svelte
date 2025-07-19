<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
</script>

<Navbar>
	<NavBrand href="/">
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">RSS-D-GENM</span>
	</NavBrand>
	<NavUl>
		<NavLi href="/">Feeds</NavLi>
		<NavLi href="/admin/feeds">Admin Feeds</NavLi>
		<NavLi href="/admin/tags">Admin Tags</NavLi>
	</NavUl>
</Navbar>
