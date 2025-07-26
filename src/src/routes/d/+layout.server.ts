import type { LayoutServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { error, } from '@sveltejs/kit';
import { DISCORD_GUILD_ID, DISCORD_ROLE_ID } from '$env/static/private';
import { discord } from '$lib/server/discord';
export const load = (async ({ request }) => {
    const session = await auth.api.getSession({
        headers: request.headers,
    });

    const user = session?.user;

    if (!user) {
        error(401, 'Unauthorized')
    }

    const acc = await auth.api.getAccessToken({ body: { providerId: "discord", userId: user.id } });
    const duser = await discord.getUser(acc.accessToken, DISCORD_GUILD_ID);

    if (!duser || !duser.roles.includes(DISCORD_ROLE_ID)) {
        console.log(duser.roles, DISCORD_ROLE_ID)
        error(401, 'Unauthorized')
    }

    return {
        session,
        user: session?.user,
        title: 'RSS'
    };

}) satisfies LayoutServerLoad;