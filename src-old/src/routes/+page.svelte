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

<h1>RSS Feeds</h1>
<FeedList {feeds} />

<style>
	h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}
</style>
