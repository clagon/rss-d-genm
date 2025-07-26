// import { DISCORD_BOT_TOKEN } from "$env/static/private";
export const discord = {
    getUser: async (accessToken: string,
        guildId: string
    ) => {
        const response = await fetch(`https://discord.com/api/users/@me/guilds/${guildId}/member`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                // Authorization: `Bot ${DISCORD_BOT_TOKEN}`,

            }
        });
        if (!response.ok) {
            console.log(await response.text())
            console.error('Failed to fetch Discord user:', response.status, response.body);
            throw new Error('Failed to fetch Discord user');
        };
        return response.json();
    }
}