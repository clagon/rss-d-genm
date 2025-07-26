import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { feeds, tags, feed_tags } from '$lib/server/db/schema';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
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
	if (feedsData) {
		return {
			feeds: feedsData.map((row) => ({
				...row,
				tags: row.tags && row.tags[0] != null ? row.tags : []
			})),
			title: 'RSS Feed'
		};
	}

	error(404, 'Not found');
};
