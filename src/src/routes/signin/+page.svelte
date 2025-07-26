<script lang="ts">
	import { authClient } from '$lib/auth-client';

	const { data } = $props();
</script>

<div>
	<button onclick={() => console.log(authClient.signIn.social({ provider: 'discord' }))}
		>Sign in with Discord</button>
</div>
