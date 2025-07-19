interface Tag {
	id: string;
	name: string;
	discord_channel_id: string;
	discord_webhook_url: string;
}

export async function getAllTags(): Promise<Tag[]> {
	const response = await fetch('/api/tags');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
}

export async function createTag(newTag: Omit<Tag, 'id'>): Promise<Tag> {
	const response = await fetch('/api/tags', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newTag)
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
}

export async function updateTag(updatedTag: Tag): Promise<Tag> {
	const response = await fetch(`/api/tags/${updatedTag.id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(updatedTag)
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response.json();
}

export async function deleteTag(id: string): Promise<void> {
	const response = await fetch(`/api/tags/${id}`, {
		method: 'DELETE'
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
}
