<script lang="ts">
	import Status from './Status.svelte';
	import Tags from './Tags.svelte';
	import { t, locale } from 'svelte-i18n';

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

<div class="feed-item glass-card w-full rounded-2xl p-6 transition-all hover:bg-slate-800/60">
	<div class="mb-4 flex w-full items-center justify-between gap-4">
		<div>
			<h2 class="shrink text-lg font-bold text-white">{feed.name}</h2>
			<span class="text-sm text-slate-400"
				>{$t('common.last_updated')}
				{feed.updated_at &&
					new Date(feed.updated_at).toLocaleDateString($locale ?? 'en-US', {
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
				text={feed.enabled ? $t('common.enabled') : $t('common.disabled')} />
		</div>
	</div>
	<a
		href={feed.url}
		target="_blank"
		class="text-primary-400 hover:text-primary-300 mb-4 block truncate hover:underline"
		>{feed.url}</a>
	<Tags tags={feed.tags.filter((tag) => !!tag).map((tag) => tag.name)} />
</div>
