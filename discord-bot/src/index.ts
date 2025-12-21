import 'dotenv/config';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { verifyKey } from 'discord-interactions';
import {
  InteractionType,
  InteractionResponseType,
  MessageFlags,
  ButtonStyle,
  ComponentType,
  TextInputStyle,
  APIChatInputApplicationCommandInteraction,
  APIModalSubmitInteraction
} from 'discord-api-types/v10';
import { db } from './db';
import { feeds, tags, feed_tags } from './db/schema';
import { eq, and } from 'drizzle-orm';

const app = new Hono();

// Authorization Middleware
const verifyDiscordRequest = async (c: any, next: any) => {
  const signature = c.req.header('X-Signature-Ed25519');
  const timestamp = c.req.header('X-Signature-Timestamp');
  const body = await c.req.text();

  const isValid = verifyKey(
    body,
    signature,
    timestamp,
    process.env.DISCORD_PUBLIC_KEY!
  );

  if (!isValid) {
    return c.text('Invalid signature', 401);
  }

  // Restore body for next handlers
  // Hono consumes the body stream, so we need to set it back or parse it here
  const jsonBody = JSON.parse(body);
  c.set('interaction', jsonBody);

  await next();
};

// Check Role Middleware Helper
const hasRequiredRole = (interaction: any): boolean => {
  const authorizedRoleId = process.env.DISCORD_AUTHORIZED_ROLE_ID;
  if (!authorizedRoleId) return true; // If no role configured, allow all (or should we deny?) - Assuming deny is safer but prompts implies restrictive if set.

  const roles = interaction.member?.roles || [];
  return roles.includes(authorizedRoleId);
};

app.post('/interactions', verifyDiscordRequest, async (c) => {
  const interaction = c.get('interaction');

  // Handle Ping
  if (interaction.type === InteractionType.Ping) {
    return c.json({ type: InteractionResponseType.Pong });
  }

  // Authorization Check
  if (!hasRequiredRole(interaction)) {
     return c.json({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content: 'You do not have permission to use this command.',
        flags: MessageFlags.Ephemeral
      }
    });
  }

  // Handle Slash Commands
  if (interaction.type === InteractionType.ApplicationCommand) {
    const { name, options } = interaction.data;

    if (name === 'list_feeds') {
      const allFeeds = await db.select().from(feeds);
      // Fetch tags for each feed
      const feedList = await Promise.all(allFeeds.map(async (feed) => {
        const linkedTags = await db.select({
            tagName: tags.name
          })
          .from(feed_tags)
          .innerJoin(tags, eq(feed_tags.tag_id, tags.id))
          .where(eq(feed_tags.feed_id, feed.id));

        const tagNames = linkedTags.map(t => t.tagName).join(', ') || 'No tags';
        return `**${feed.name}** (${feed.url})\nTags: ${tagNames}`;
      }));

      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: feedList.length > 0 ? feedList.join('\n\n') : 'No feeds registered.',
        }
      });
    }

    if (name === 'list_tags') {
      const allTags = await db.select().from(tags);
      const tagList = allTags.map(t => `**${t.name}** - Webhook: ${t.discord_webhook_url}`);

      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: tagList.length > 0 ? tagList.join('\n') : 'No tags registered.',
        }
      });
    }

    if (name === 'create_feed') {
      return c.json({
        type: InteractionResponseType.Modal,
        data: {
          custom_id: 'create_feed_modal',
          title: 'Create Feed',
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'feed_name',
                  label: 'Feed Name',
                  style: TextInputStyle.Short,
                  required: true
                }
              ]
            },
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'feed_url',
                  label: 'Feed URL',
                  style: TextInputStyle.Short,
                  required: true
                }
              ]
            }
          ]
        }
      });
    }

    if (name === 'create_tag') {
       return c.json({
        type: InteractionResponseType.Modal,
        data: {
          custom_id: 'create_tag_modal',
          title: 'Create Tag',
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'tag_name',
                  label: 'Tag Name',
                  style: TextInputStyle.Short,
                  required: true
                }
              ]
            },
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'webhook_url',
                  label: 'Discord Webhook URL',
                  style: TextInputStyle.Short,
                  required: true
                }
              ]
            }
          ]
        }
      });
    }

    if (name === 'edit_feed') {
      const feedName = options.find((o: any) => o.name === 'name')?.value;
      const feed = await db.select().from(feeds).where(eq(feeds.name, feedName)).limit(1);

      if (feed.length === 0) {
         return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Feed "${feedName}" not found.`,
            flags: MessageFlags.Ephemeral
          }
        });
      }

      const f = feed[0];

      return c.json({
        type: InteractionResponseType.Modal,
        data: {
          custom_id: `edit_feed_modal:${f.id}`,
          title: 'Edit Feed',
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'feed_name',
                  label: 'Feed Name',
                  style: TextInputStyle.Short,
                  value: f.name,
                  required: true
                }
              ]
            },
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'feed_url',
                  label: 'Feed URL',
                  style: TextInputStyle.Short,
                  value: f.url,
                  required: true
                }
              ]
            },
             {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'feed_enabled',
                  label: 'Enabled (true/false)',
                  style: TextInputStyle.Short,
                  value: String(f.enabled),
                  required: true
                }
              ]
            }
          ]
        }
      });
    }

    if (name === 'edit_tag') {
      const tagName = options.find((o: any) => o.name === 'name')?.value;
      const tag = await db.select().from(tags).where(eq(tags.name, tagName)).limit(1);

      if (tag.length === 0) {
         return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: {
            content: `Tag "${tagName}" not found.`,
            flags: MessageFlags.Ephemeral
          }
        });
      }

      const t = tag[0];

      return c.json({
        type: InteractionResponseType.Modal,
        data: {
          custom_id: `edit_tag_modal:${t.id}`,
          title: 'Edit Tag',
          components: [
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'tag_name',
                  label: 'Tag Name',
                  style: TextInputStyle.Short,
                  value: t.name,
                  required: true
                }
              ]
            },
            {
              type: ComponentType.ActionRow,
              components: [
                {
                  type: ComponentType.TextInput,
                  custom_id: 'webhook_url',
                  label: 'Webhook URL',
                  style: TextInputStyle.Short,
                  value: t.discord_webhook_url,
                  required: true
                }
              ]
            }
          ]
        }
      });
    }

    if (name === 'link_tag') {
      const feedName = options.find((o: any) => o.name === 'feed_name')?.value;
      const tagName = options.find((o: any) => o.name === 'tag_name')?.value;

      const feed = await db.select().from(feeds).where(eq(feeds.name, feedName)).limit(1);
      const tag = await db.select().from(tags).where(eq(tags.name, tagName)).limit(1);

      if (feed.length === 0 || tag.length === 0) {
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: 'Feed or Tag not found.', flags: MessageFlags.Ephemeral }
        });
      }

      try {
        await db.insert(feed_tags).values({
          feed_id: feed[0].id,
          tag_id: tag[0].id
        });
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: `Linked tag "${tagName}" to feed "${feedName}".` }
        });
      } catch (e) {
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: 'Failed to link. Maybe already linked?', flags: MessageFlags.Ephemeral }
        });
      }
    }

    if (name === 'unlink_tag') {
      const feedName = options.find((o: any) => o.name === 'feed_name')?.value;
      const tagName = options.find((o: any) => o.name === 'tag_name')?.value;

      const feed = await db.select().from(feeds).where(eq(feeds.name, feedName)).limit(1);
      const tag = await db.select().from(tags).where(eq(tags.name, tagName)).limit(1);

      if (feed.length === 0 || tag.length === 0) {
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: 'Feed or Tag not found.', flags: MessageFlags.Ephemeral }
        });
      }

      await db.delete(feed_tags)
        .where(and(
          eq(feed_tags.feed_id, feed[0].id),
          eq(feed_tags.tag_id, tag[0].id)
        ));

      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: `Unlinked tag "${tagName}" from feed "${feedName}".` }
      });
    }
  }

  // Handle Modal Submits
  if (interaction.type === InteractionType.ModalSubmit) {
    const { custom_id, components } = interaction.data;

    // Helper to get value from components
    const getValue = (id: string) => {
      // Structure is components[Row].components[0].value
      // We iterate to find the right custom_id
      for (const row of components) {
        for (const component of row.components) {
          if (component.custom_id === id) return component.value;
        }
      }
      return null;
    };

    if (custom_id === 'create_feed_modal') {
      const name = getValue('feed_name');
      const url = getValue('feed_url');

      try {
        await db.insert(feeds).values({
          name,
          url,
          enabled: true
        });
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: `Feed "${name}" created.` }
        });
      } catch (e) {
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: 'Failed to create feed. Name might be duplicate or invalid.', flags: MessageFlags.Ephemeral }
        });
      }
    }

    if (custom_id === 'create_tag_modal') {
      const name = getValue('tag_name');
      const webhook_url = getValue('webhook_url');

      try {
        await db.insert(tags).values({
          name,
          discord_webhook_url: webhook_url
        });
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: `Tag "${name}" created.` }
        });
      } catch (e) {
        return c.json({
          type: InteractionResponseType.ChannelMessageWithSource,
          data: { content: 'Failed to create tag. Name might be duplicate.', flags: MessageFlags.Ephemeral }
        });
      }
    }

    if (custom_id.startsWith('edit_feed_modal:')) {
      const feedId = custom_id.split(':')[1];
      const name = getValue('feed_name');
      const url = getValue('feed_url');
      const enabledRaw = getValue('feed_enabled');
      const enabled = enabledRaw?.toLowerCase() === 'true';

      await db.update(feeds)
        .set({ name, url, enabled, updated_at: new Date() })
        .where(eq(feeds.id, feedId));

      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: `Feed updated.` }
      });
    }

    if (custom_id.startsWith('edit_tag_modal:')) {
      const tagId = custom_id.split(':')[1];
      const name = getValue('tag_name');
      const webhook_url = getValue('webhook_url');

      await db.update(tags)
        .set({ name, discord_webhook_url: webhook_url, updated_at: new Date() })
        .where(eq(tags.id, tagId));

      return c.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: { content: `Tag updated.` }
      });
    }
  }

  return c.json({ error: 'Unknown interaction' }, 400);
});

const port = Number(process.env.PORT) || 3000;

if (require.main === module || process.env.NODE_ENV !== 'test') {
    console.log(`Server is running on port ${port}`);
    serve({
      fetch: app.fetch,
      port
    });
}

export default app;
