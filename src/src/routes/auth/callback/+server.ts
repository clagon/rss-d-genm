import { redirect } from '@sveltejs/kit';

export const GET = async ({ url, locals: { supabase } }) => {
	console.log('auth/callback/+server.ts: GET called');
	const code = url.searchParams.get('access_token') || url.searchParams.get('code');
	// const next = url.searchParams.get('next') ?? '/';
	console.log('auth/callback/+server.ts: code:', code);
	if (code) {
		await supabase.auth.exchangeCodeForSession(code);
	}

	throw redirect(302, '/');
};
