import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { supabase } }) => {
	const {
		data: { session }
	} = await supabase.auth.getSession();

	if (session) {
		throw redirect(302, '/');
	}

	return { url: url.origin };
};
