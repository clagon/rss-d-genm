import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { feeds, tags } from '$lib/server/db/schema';
import { desc, eq, getTableColumns } from 'drizzle-orm';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ request }) => {

    const session = await auth.api.getSession({
        headers: request.headers,
    });
    if (!session?.user) {
        error(401, 'Unauthorized');
    }

    const tagsData = await db
        .select({
            ...getTableColumns(tags),
        })
        .from(tags)
        .orderBy(desc(tags.updated_at));
    if (tagsData) {
        return {
            tags: tagsData,
            title: 'RSS Feed'
        };
    }

    error(404, 'Not found');
};

export const actions = {
    get: async ({ request }) => {
        console.log('get action called');
        const data = await request.formData();
        const feedId: string = data.get('id') as string;
        if (!feedId) {
            return { success: false, message: 'Feed ID is required' };
        }
        const tagData = await db.query.tags.findFirst({
            where: eq(tags.id, feedId),
        });
        return {
            tag: tagData
        };
    },
    register: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        const name = data.get('name');
        const discord_webhook_url = data.get('discord_webhook_url');
        const discord_channel_id = data.get('discord_channel_id');

        console.log('Registering feed:', { name, discord_webhook_url, discord_channel_id });

        if (typeof name !== 'string' || typeof discord_webhook_url !== 'string' || typeof discord_channel_id !== 'string') {
            return { success: false, message: 'Invalid input' };
        }

        try {
            // トランザクション開始
            await db.transaction(async (tx) => {
                // フィード情報をUpsert
                const updateValues: typeof tags.$inferInsert = {
                    name,
                    discord_webhook_url,
                    discord_channel_id,
                }
                if (id) {
                    updateValues.id = id as string;
                }
                const tagId = await tx
                    .insert(tags)
                    .values(updateValues)
                    .onConflictDoUpdate({
                        target: tags.id,
                        set: {
                            name,
                            discord_webhook_url,
                            discord_channel_id,
                        }
                    })
                    .returning({ id: tags.id });

                // tagIdが空の場合はロールバック
                if (tagId.length === 0) {
                    tx.rollback();
                }
            });
        } catch (error) {
            console.error('Error during transaction:', error);
            return { success: false, message: 'Failed to register feed' };
        }
        return { success: true };
    },
    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        if (typeof id !== 'string') {
            return { success: false, message: 'Invalid ID' };
        }
        try {
            await db.delete(tags).where(eq(tags.id, id));
        } catch (e: any) {
            console.error('Error deleting tag:', e);
            error(500, `Failed to delete tag: ${e.message}`);
        }
        return { success: true };
    }
} satisfies Actions;
