import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import { DISCORD_GUILD_ID, DISCORD_ROLE_ID } from '$env/static/private';
import { discord } from '$lib/server/discord';

// Simple in-memory cache to avoid hitting Discord API on every request
// Key: userId, Value: { authorized: boolean, timestamp: number }
const roleCache = new Map<string, { authorized: boolean, timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const load = (async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const user = session?.user;

    if (!user) {
        error(401, 'Unauthorized');
    }

    const cacheKey = user.id;
    const cached = roleCache.get(cacheKey);
    const now = Date.now();

    if (cached && (now - cached.timestamp < CACHE_TTL)) {
        if (!cached.authorized) {
            error(401, 'Unauthorized');
        }
        // Authorized, proceed
    } else {
        try {
            const acc = await auth.api.getAccessToken({ body: { providerId: "discord", userId: user.id } });
            const duser = await discord.getUser(acc.accessToken, DISCORD_GUILD_ID);

            if (!duser || !duser.roles.includes(DISCORD_ROLE_ID)) {
                console.log(duser?.roles, DISCORD_ROLE_ID);
                roleCache.set(cacheKey, { authorized: false, timestamp: now });
                error(401, 'Unauthorized');
            }

            roleCache.set(cacheKey, { authorized: true, timestamp: now });
        } catch (e: any) {
            console.error('Discord check failed:', e);
            // If it's our own 401 error (SvelteKit error), rethrow it
            if (e?.status === 401) {
                throw e;
            }
            // For other errors (network etc), fail safe.
            throw error(500, 'Failed to verify Discord membership');
        }
    }

    return {
        session,
        user: session?.user,
        title: 'RSS'
    };

}) satisfies LayoutServerLoad;