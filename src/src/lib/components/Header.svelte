<script lang="ts">
	import { Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
</script>

<Navbar>
	<NavBrand href="/">
		<span class="nav-title">RSS-D-GENM</span>
	</NavBrand>
	<NavUl>
		<NavLi href="/">Feeds</NavLi>
		<NavLi href="/admin/feeds">Admin Feeds</NavLi>
		<NavLi href="/admin/tags">Admin Tags</NavLi>
	</NavUl>
</Navbar>

<style>
	.nav-title {
		align-self: center;
		white-space: nowrap;
		font-size: 1.25rem;
		font-weight: 600;
	}
	.dark .nav-title {
		color: #fff;
	}
</style>
