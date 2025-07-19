import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('feeds')
    .select('*, tags(*)')
    .eq('enabled', true);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(data);
};

export const POST: RequestHandler = async ({ request, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, url, enabled, tags } = await request.json();
  const { data, error } = await supabase
    .from('feeds')
    .insert({ name, url, enabled })
    .select();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  const feed = data[0];

  if (tags && tags.length > 0) {
    const feedTags = tags.map((tag_id: string) => ({ feed_id: feed.id, tag_id }));
    const { error: tagsError } = await supabase.from('feed_tags').insert(feedTags);
    if (tagsError) {
      return json({ error: tagsError.message }, { status: 500 });
    }
  }

  return json(feed);
};
