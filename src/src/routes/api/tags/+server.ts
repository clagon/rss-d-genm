import { json } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function GET() {
	const { data, error } = await supabase.from('tags').select('*');

	if (error) {
		return json({ error: error.message }, { status: 500 });
	}

	return json(data);
}

export async function POST({ request }) {
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
