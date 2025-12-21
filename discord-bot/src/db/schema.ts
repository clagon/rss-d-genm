import {
	pgTable, primaryKey, boolean, uuid, timestamp, varchar
} from 'drizzle-orm/pg-core';

export const feeds = pgTable('feeds', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	url: varchar('url').notNull(),
	enabled: boolean('enabled').notNull(),
	last_posted_guid: varchar('last_posted_guid'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow()
});

export const tags = pgTable('tags', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull().unique(),
	discord_channel_id: varchar('discord_channel_id'),
	discord_webhook_url: varchar('discord_webhook_url').notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow()
});

export const feed_tags = pgTable(
	'feed_tags',
	{
		feed_id: uuid('feed_id')
			.notNull()
			.references(() => feeds.id),
		tag_id: uuid('tag_id')
			.notNull()
			.references(() => tags.id)
	},
	(table) => [primaryKey({ columns: [table.feed_id, table.tag_id] })]
);
