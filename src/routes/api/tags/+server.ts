import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase.from('tags').select('*');

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

  const { name, discord_channel_id, discord_webhook_url } = await request.json();
  const { data, error } = await supabase
    .from('tags')
    .insert({ name, discord_channel_id, discord_webhook_url })
    .select();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(data[0]);
};
