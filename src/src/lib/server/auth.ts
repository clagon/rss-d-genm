import { betterAuth } from "better-auth";
// import { sveltekitCookies } from "better-auth/svelte-kit";
// import { getRequestEvent } from "$app/server";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; // your drizzle instance
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg", // or "mysql", "sqlite"
    }),
    // https://www.better-auth.com/docs/concepts/oauth
    socialProviders: {
        discord: {
            clientId: env.DISCORD_CLIENT_ID!,
            clientSecret: env.DISCORD_CLIENT_SECRET!,
            scope: ["guilds", "guilds.members.read"]
        },
    },

});