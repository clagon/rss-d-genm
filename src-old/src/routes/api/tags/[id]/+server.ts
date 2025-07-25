import { json } from '@sveltejs/kit';

export async function GET({ params, locals: { supabase } }) {
	const { id } = params;

	const { data, error } = await supabase.from('tags').select('*').eq('id', id).single();

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	if (!data) {
		return json({ error: 'Tag not found' }, { status: 404 });
	}

	return json(data);
}

export async function PUT({ params, request, locals: { supabase } }) {
	const { id } = params;
	const { name, discord_channel_id, discord_webhook_url } = await request.json();

	const { data, error } = await supabase
		.from('tags')
		.update({ name, discord_channel_id, discord_webhook_url, updated_at: new Date().toISOString() })
		.eq('id', id)
		.select();

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	if (!data || data.length === 0) {
		return json({ error: 'Tag not found' }, { status: 404 });
	}

	return json(data[0]);
}

export async function DELETE({ params, locals: { supabase } }) {
	const { id } = params;

	const { error } = await supabase.from('tags').delete().eq('id', id);

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return new Response(null, { status: 204 });
}
