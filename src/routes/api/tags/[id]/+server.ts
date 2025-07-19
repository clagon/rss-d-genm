import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const PUT: RequestHandler = async ({ request, params, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name, discord_channel_id, discord_webhook_url } = await request.json();
  const { data, error } = await supabase
    .from('tags')
    .update({ name, discord_channel_id, discord_webhook_url })
    .eq('id', params.id)
    .select();

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return json(data[0]);
};

export const DELETE: RequestHandler = async ({ params, locals: { supabase, getSession } }) => {
  const session = await getSession();
  if (!session) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { error } = await supabase.from('tags').delete().eq('id', params.id);

  if (error) {
    return json({ error: error.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
};
