<script lang="ts">
	import Status from './Status.svelte';
	import Tags from './Tags.svelte';

	let {
		feed
	}: {
		feed: {
			id: string;
			name: string | null;
			url: string | null;
			enabled: boolean | null;
			last_posted_guid: string | null;
			created_at: Date | null;
			updated_at: Date | null;
			tags: {
				id: string;
				name: string;
				created_at: Date | null;
				updated_at: Date | null;
				discord_channel_id: string | null;
				discord_webhook_url: string;
			}[];
		};
	} = $props();
</script>

<div class="feed-item w-full rounded-2xl bg-white p-4 shadow">
	<div class="flex w-full items-center justify-between gap-4">
		<div>
			<h2 class="shrink text-lg font-semibold">{feed.name}</h2>
			<span class="text-sm text-gray-500"
				>last updated：{feed.updated_at &&
					new Date(feed.updated_at).toLocaleDateString('ja-JP', {
						// weekday: 'short',
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit'
					})}</span>
		</div>
		<div>
			<Status
				color={feed.enabled ? 'bg-teal-500' : 'bg-rose-500'}
				text={feed.enabled ? 'Enabled' : 'Disabled'} />
		</div>
	</div>
	<p class="mb-2">{feed.url}</p>
	<Tags tags={feed.tags.filter((tag) => !!tag).map((tag) => tag.name)} />
</div>
