import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function GET() {
	const { data, error } = await supabase.from('feeds').select('*, feed_tags(tags(name))');

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	const feeds = data.map((feed: any) => ({
		...feed,
		tags: feed.feed_tags.map((ft: any) => ft.tags.name)
	}));

	return json(feeds);
}

export async function POST({ request }) {
	const { name, url, tags, enabled } = await request.json();

	const { data: feedData, error: feedError } = await supabase
		.from('feeds')
		.insert([{ name, url, enabled }])
		.select();

	if (feedError) {
		return json({ error: feedError.message }, { status: 500 });
	}

	const newFeed = feedData[0];

	if (tags && tags.length > 0) {
		// Fetch tag IDs based on tag names
		const { data: tagIdsData, error: tagIdsError } = await supabase
			.from('tags')
			.select('id')
			.in('name', tags);

		if (tagIdsError) {
			console.error('Error fetching tag IDs:', tagIdsError);
			// Optionally, roll back the feed creation or handle this error differently
			return json({ error: tagIdsError.message }, { status: 500 });
		}

		const feedTagsToInsert = tagIdsData.map((tag: { id: string }) => ({
			feed_id: newFeed.id,
			tag_id: tag.id
		}));

		const { error: feedTagsError } = await supabase.from('feed_tags').insert(feedTagsToInsert);

		if (feedTagsError) {
			console.error('Error inserting feed tags:', feedTagsError);
			// Optionally, roll back the feed creation or handle this error differently
			return json({ error: feedTagsError.message }, { status: 500 });
		}
	}

	// Re-fetch the newly created feed with its tags for a complete response
	const { data: finalFeedData, error: finalFeedError } = await supabase
		.from('feeds')
		.select('*, feed_tags(tags(name))')
		.eq('id', newFeed.id)
		.single();

	if (finalFeedError) {
		return json({ error: finalFeedError.message }, { status: 500 });
	}

	const finalFeed = {
		...finalFeedData,
		tags: finalFeedData.feed_tags.map((ft: any) => ft.tags.name)
	};

	return json(finalFeed, { status: 201 });
}
