import type { RequestHandler } from './$types';
import { auth } from '$lib/server/auth';

export const GET: RequestHandler = ({ url, request }) => {
	auth.api.signOut({ headers: request.headers });
	return new Response(null, {
		status: 302,
		headers: {
			Location: url.origin + '/list'
		}
	});
};