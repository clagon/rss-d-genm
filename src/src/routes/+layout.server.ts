import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';
export const load = (async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });
    return {
        session,
        user: session?.user,
        title: 'RSS'
    };

}) satisfies LayoutServerLoad;