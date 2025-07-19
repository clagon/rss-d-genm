import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function GET({ params }) {
	const { id } = params;

	const { data, error } = await supabase.from('feeds').select('*, feed_tags(tags(name))').eq('id', id).single();

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	if (!data) {
		return json({ error: 'Feed not found' }, { status: 404 });
	}

	const feed = {
		...data,
		tags: data.feed_tags.map((ft: any) => ft.tags.name)
	};

	return json(feed);
}

export async function PUT({ params, request }) {
	const { id } = params;
	const { name, url, tags, enabled } = await request.json();

	// Update feed details
	const { data: feedData, error: feedError } = await supabase
		.from('feeds')
		.update({ name, url, enabled, updated_at: new Date().toISOString() })
		.eq('id', id)
		.select();

	if (feedError) {
		return json({ error: feedError.message }, { status: 500 });
	}

	if (!feedData || feedData.length === 0) {
		return json({ error: 'Feed not found' }, { status: 404 });
	}

	// Update feed_tags (delete existing and insert new ones)
	const { error: deleteError } = await supabase.from('feed_tags').delete().eq('feed_id', id);

	if (deleteError) {
		console.error('Error deleting existing feed tags:', deleteError);
		return json({ error: deleteError.message }, { status: 500 });
	}

	if (tags && tags.length > 0) {
		const { data: tagIdsData, error: tagIdsError } = await supabase
			.from('tags')
			.select('id')
			.in('name', tags);

		if (tagIdsError) {
			console.error('Error fetching tag IDs for update:', tagIdsError);
			return json({ error: tagIdsError.message }, { status: 500 });
		}

		const feedTagsToInsert = tagIdsData.map((tag: { id: string }) => ({
			feed_id: id,
			tag_id: tag.id
		}));

		const { error: insertError } = await supabase.from('feed_tags').insert(feedTagsToInsert);

		if (insertError) {
			console.error('Error inserting new feed tags:', insertError);
			return json({ error: insertError.message }, { status: 500 });
		}
	}

	// Re-fetch the updated feed with its tags for a complete response
	const { data: finalFeedData, error: finalFeedError } = await supabase
		.from('feeds')
		.select('*, feed_tags(tags(name))')
		.eq('id', id)
		.single();

	if (finalFeedError) {
		return json({ error: finalFeedError.message }, { status: 500 });
	}

	const finalFeed = {
		...finalFeedData,
		tags: finalFeedData.feed_tags.map((ft: any) => ft.tags.name)
	};

	return json(finalFeed);
}

export async function DELETE({ params }) {
	const { id } = params;

	const { error } = await supabase.from('feeds').delete().eq('id', id);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return new Response(null, { status: 204 });
}
