<script lang="ts">
	import FeedList from '$lib/components/FeedList.svelte';
	import * as feedApi from '$lib/api/feeds';
	import { onMount } from 'svelte';

	interface Feed {
		id: string;
		name: string;
		url: string;
		tags: string[];
		enabled: boolean;
	}

	let feeds: Feed[] = [];

	onMount(async () => {
		feeds = await feedApi.getAllFeeds();
	});
</script>

<h1 class="text-2xl font-bold mb-4">RSS Feeds</h1>
<FeedList {feeds} />
