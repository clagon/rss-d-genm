import { redirect } from '@sveltejs/kit';
import { DISCORD_CLIENT_ID } from '$env/static/private';

export function GET() {
	const discordAuthUrl = `https://discord.com/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent('http://localhost:5173/api/auth/callback')}&scope=identify%20guilds`;
	throw redirect(302, discordAuthUrl);
}
