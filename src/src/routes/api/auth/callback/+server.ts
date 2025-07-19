import { redirect } from '@sveltejs/kit';
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_GUILD_ID } from '$env/static/private';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

export async function GET({ url, cookies }) {
	const code = url.searchParams.get('code');

	if (!code) {
		throw redirect(302, '/');
	}

	const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

	try {
		// Exchange code for access token
		const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: DISCORD_CLIENT_ID,
				client_secret: DISCORD_CLIENT_SECRET,
				grant_type: 'authorization_code',
				code,
				redirect_uri: 'http://localhost:5173/api/auth/callback'
			}).toString()
		});

		const tokenData = await tokenResponse.json();

		if (!tokenResponse.ok) {
			console.error('Discord token exchange failed:', tokenData);
			throw redirect(302, '/');
		}

		const { access_token } = tokenData;

		// Get user info
		const userResponse = await fetch('https://discord.com/api/users/@me', {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		const userData = await userResponse.json();

		if (!userResponse.ok) {
			console.error('Discord user info fetch failed:', userData);
			throw redirect(302, '/');
		}

		const { id: discord_id, username, avatar } = userData;
		const avatar_url = avatar ? `https://cdn.discordapp.com/avatars/${discord_id}/${avatar}.png` : null;

		// Check if user is in the required Discord guild
		const guildsResponse = await fetch('https://discord.com/api/users/@me/guilds', {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		});
		const guildsData = await guildsResponse.json();

		if (!guildsResponse.ok) {
			console.error('Discord guilds fetch failed:', guildsData);
			throw redirect(302, '/');
		}

		const isInGuild = guildsData.some((guild: { id: string }) => guild.id === DISCORD_GUILD_ID);

		if (!isInGuild) {
			console.warn('User not in required Discord guild.');
			throw redirect(302, '/'); // Redirect if not in guild
		}

		// Upsert user into Supabase
		const { data: supabaseUser, error: upsertError } = await supabase
			.from('users')
			.upsert(
				{
					discord_id,
					username,
					avatar_url,
					// role will default to 'user' or be updated if already exists
				},
				{ onConflict: 'discord_id' }
			)
			.select();

		if (upsertError) {
			console.error('Supabase upsert error:', upsertError);
			throw redirect(302, '/');
		}

		// Set session cookie (simplified for now, will integrate with Supabase auth later)
		cookies.set('session', JSON.stringify({ discord_id, username, role: supabaseUser[0].role }), {
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 1 week
			httpOnly: true,
			sameSite: 'lax'
		});

		throw redirect(302, '/');
	} catch (error) {
		console.error('Authentication error:', error);
		throw redirect(302, '/');
	}
}
