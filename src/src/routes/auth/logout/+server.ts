import { redirect } from '@sveltejs/kit';

export const POST = async (event) => {
	const { locals: { supabase } } = event;
	const { error } = await supabase.auth.signOut();
	if (error) {
		console.error('Error signing out:', error);
		return new Response('Failed to log out', { status: 500 });
	}
	throw redirect(302, '/login');
};
