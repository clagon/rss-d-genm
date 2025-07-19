interface Feed {
	id: string;
	name: string;
	url: string;
	tags: string[];
	enabled: boolean;
}

export async function getAllFeeds(): Promise<Feed[]> {
	const response = await fetch('/api/feeds');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
}

export async function createFeed(newFeed: Omit<Feed, 'id'>): Promise<Feed> {
	const response = await fetch('/api/feeds', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newFeed)
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
}

export async function updateFeed(updatedFeed: Feed): Promise<Feed> {
	const response = await fetch(`/api/feeds/${updatedFeed.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updatedFeed)
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
}

export async function deleteFeed(id: string): Promise<void> {
	const response = await fetch(`/api/feeds/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}
