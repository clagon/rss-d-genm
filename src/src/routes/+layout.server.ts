import type { LayoutServerLoad } from "./$types";

export const load = (async ({ locals: { safeGetSession }, cookies }) => {

	const { user, session } = await safeGetSession();

	return {
		user,
		session,
		cookies: cookies.getAll(),
	};

}) satisfies LayoutServerLoad;