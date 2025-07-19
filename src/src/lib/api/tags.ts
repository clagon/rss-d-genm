interface Tag {
	id: string;
	name: string;
	discord_channel_id: string;
	discord_webhook_url: string;
}

let mockTags: Tag[] = [
	{ id: '1', name: 'AI', discord_channel_id: '1234567890', discord_webhook_url: 'https://discord.com/api/webhooks/ai' },
	{ id: '2', name: 'WebDev', discord_channel_id: '0987654321', discord_webhook_url: 'https://discord.com/api/webhooks/webdev' },
];

export function getAllTags(): Tag[] {
	return mockTags;
}

export function createTag(newTag: Omit<Tag, 'id'>): Tag {
	const id = String(mockTags.length > 0 ? Math.max(...mockTags.map(t => Number(t.id))) + 1 : 1);
	const tag = { ...newTag, id };
	mockTags.push(tag);
	return tag;
}

export function updateTag(updatedTag: Tag): Tag {
	mockTags = mockTags.map(tag => (tag.id === updatedTag.id ? updatedTag : tag));
	return updatedTag;
}

export function deleteTag(id: string): void {
	mockTags = mockTags.filter(tag => tag.id !== id);
}
