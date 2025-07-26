<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="flex flex-col items-center gap-2">
	<h1>{page.status}{page?.error?.message}</h1>
	<a
		href="/"
		class="text-blue-500 hover:underline">Go back to home</a>
</div>
