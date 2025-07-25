import { json } from '@sveltejs/kit';

export async function GET({ locals: { supabase } }) {
	const { data, error } = await supabase.from('tags').select('*');

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json(data);
}

export async function POST({ request, locals: { supabase } }) {
	const { name, discord_channel_id, discord_webhook_url } = await request.json();

	const { data, error } = await supabase
		.from('tags')
		.insert([{ name, discord_channel_id, discord_webhook_url }])
		.select();

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json(data[0], { status: 201 });
}
