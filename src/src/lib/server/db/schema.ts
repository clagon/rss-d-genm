import {
	pgTable, primaryKey, boolean, uuid, timestamp, varchar, text, index
} from 'drizzle-orm/pg-core';

export const feeds = pgTable('feeds', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull(),
	url: varchar('url').notNull(),
	enabled: boolean('enabled').notNull(),
	last_posted_guid: varchar('last_posted_guid'),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow()
}, (table) => [
	index('feeds_updated_at_idx').on(table.updated_at)
]);

export const tags = pgTable('tags', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name').notNull().unique(),
	discord_channel_id: varchar('discord_channel_id'),
	discord_webhook_url: varchar('discord_webhook_url').notNull(),
	created_at: timestamp('created_at').defaultNow(),
	updated_at: timestamp('updated_at').defaultNow()
}, (table) => [
	index('tags_updated_at_idx').on(table.updated_at)
]);

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

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified")
		.$defaultFn(() => false)
		.notNull(),
	image: text("image"),
	createdAt: timestamp("created_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
	updatedAt: timestamp("updated_at")
		.$defaultFn(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expires_at").notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull(),
	updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
	updatedAt: timestamp("updated_at").$defaultFn(
		() => /* @__PURE__ */ new Date(),
	),
});
