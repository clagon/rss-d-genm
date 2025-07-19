import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, params, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, url, enabled, tags } = await request.json();
  const { data, error } = await supabase
    .from('feeds')
    .update({ name, url, enabled })
    .eq('id', params.id)
    .select();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  const feed = data[0];

  const { error: deleteError } = await supabase.from('feed_tags').delete().eq('feed_id', feed.id);
  if (deleteError) {
    return json({ error: deleteError.message }, { status: 500 });
  }

  if (tags && tags.length > 0) {
    const feedTags = tags.map((tag_id: string) => ({ feed_id: feed.id, tag_id }));
    const { error: tagsError } = await supabase.from('feed_tags').insert(feedTags);
    if (tagsError) {
      return json({ error: tagsError.message }, { status: 500 });
    }
  }

  return json(feed);
};

export const DELETE: RequestHandler = async ({ params, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase.from('feeds').delete().eq('id', params.id);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
};
