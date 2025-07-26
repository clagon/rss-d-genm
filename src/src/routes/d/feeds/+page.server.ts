import { error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { feeds, tags, feed_tags } from '$lib/server/db/schema';
import { and, desc, eq, getTableColumns, notInArray, sql } from 'drizzle-orm';
import { auth } from '$lib/server/auth';

export const load: PageServerLoad = async ({ request }) => {

    const session = await auth.api.getSession({
        headers: request.headers,
    });
    if (!session?.user) {
        error(401, 'Unauthorized');
    }

    const feedsData = await db
        .select({
            ...getTableColumns(feeds),
            tags: sql<(typeof tags.$inferSelect)[] | null>`json_agg(${tags})`
        })
        .from(feeds)
        .leftJoin(feed_tags, eq(feeds.id, feed_tags.feed_id))
        .leftJoin(tags, eq(feed_tags.tag_id, tags.id))
        .groupBy(feeds.id)
        .orderBy(desc(feeds.updated_at));
    const tagsData = await db
        .select()
        .from(tags)
        .orderBy(desc(tags.updated_at));
    if (feedsData) {
        return {
            feeds: feedsData.map((row) => ({
                ...row,
                tags: row.tags && row.tags[0] != null ? row.tags : []
            })),
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
        const feedsData = await db
            .select({
                ...getTableColumns(feeds),
                tags: sql<(typeof tags.$inferSelect)[] | null>`json_agg(${tags})`
            })
            .from(feeds)
            .leftJoin(feed_tags, eq(feeds.id, feed_tags.feed_id))
            .leftJoin(tags, eq(feed_tags.tag_id, tags.id))
            .where(eq(feeds.id, feedId))
            .groupBy(feeds.id)
            .orderBy(desc(feeds.updated_at));
        return {
            feed: feedsData.map((row) => ({
                ...row,
                tags: row.tags && row.tags[0] != null ? row.tags.map(tag => tag.id) : []
            }))[0]
        };
    },
    register: async ({ request }) => {
        const data = await request.formData();
        const id = data.get('id');
        const name = data.get('name');
        const url = data.get('url');
        const enabled = data.get('enabled') === 'on';
        const tagArr = data.getAll('tags') as string[];

        console.log('Registering feed:', { name, url, enabled, tagArr });

        if (typeof name !== 'string' || typeof url !== 'string') {
            return { success: false, message: 'Invalid input' };
        }

        try {
            // トランザクション開始
            await db.transaction(async (tx) => {
                // フィード情報をUpsert
                const updateValues: typeof feeds.$inferInsert = {
                    name,
                    url,
                    enabled,
                }
                if (id) {
                    updateValues.id = id as string;
                }
                const feedId = await tx
                    .insert(feeds)
                    .values(updateValues)
                    .onConflictDoUpdate({
                        target: feeds.id,
                        set: {
                            name,
                            url,
                            enabled
                        }
                    })
                    .returning({ id: feeds.id });

                // feedIdが空の場合はロールバック
                if (feedId.length === 0) {
                    tx.rollback();
                }

                // UpsertしたフィードのIDを取得
                const feedIdValue = feedId[0].id;

                // タグ情報の更新
                if (tagArr.length === 0) {
                    // タグがない場合は、feed_tagsを削除
                    await tx.delete(feed_tags).where(eq(feed_tags.feed_id, feedIdValue));
                    return;
                }

                await tx
                    .insert(feed_tags)
                    .values(
                        tagArr.map((tagId) => ({
                            feed_id: feedIdValue,
                            tag_id: tagId
                        }))
                    )
                    .onConflictDoNothing();

                // 既存のタグを削除
                await tx
                    .delete(feed_tags)
                    .where(and(eq(feed_tags.feed_id, feedIdValue), notInArray(feed_tags.tag_id, tagArr)));
            });
        } catch (error) {
            console.error('Error during transaction:', error);
            return { success: false, message: 'Failed to register feed' };
        }
    }
} satisfies Actions;
