interface Feed {
	id: string;
	name: string;
	url: string;
	tags: string[];
	enabled: boolean;
}

let mockFeeds: Feed[] = [
	{ id: '1', name: 'Google AI Blog', url: 'https://ai.googleblog.com/feeds/posts/default', tags: ['AI', 'Google'], enabled: true },
	{ id: '2', name: 'Svelte Blog', url: 'https://svelte.dev/blog/rss.xml', tags: ['Svelte', 'WebDev'], enabled: false },
];

export function getAllFeeds(): Feed[] {
	return mockFeeds;
}

export function createFeed(newFeed: Omit<Feed, 'id'>): Feed {
	const id = String(mockFeeds.length > 0 ? Math.max(...mockFeeds.map(f => Number(f.id))) + 1 : 1);
	const feed = { ...newFeed, id };
	mockFeeds.push(feed);
	return feed;
}

export function updateFeed(updatedFeed: Feed): Feed {
	mockFeeds = mockFeeds.map(feed => (feed.id === updatedFeed.id ? updatedFeed : feed));
	return updatedFeed;
}

export function deleteFeed(id: string): void {
	mockFeeds = mockFeeds.filter(feed => feed.id !== id);
}
