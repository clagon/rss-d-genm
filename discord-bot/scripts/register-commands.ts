import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import {
  SlashCommandBuilder,
} from '@discordjs/builders';

const { DISCORD_TOKEN, DISCORD_APPLICATION_ID } = process.env;

if (!DISCORD_TOKEN || !DISCORD_APPLICATION_ID) {
  throw new Error('Missing DISCORD_TOKEN or DISCORD_APPLICATION_ID');
}

const commands = [
  new SlashCommandBuilder()
    .setName('list_feeds')
    .setDescription('List all registered feeds and their associated tags'),
  new SlashCommandBuilder()
    .setName('list_tags')
    .setDescription('List all registered tags'),
  new SlashCommandBuilder()
    .setName('create_feed')
    .setDescription('Create a new feed'),
  new SlashCommandBuilder()
    .setName('create_tag')
    .setDescription('Create a new tag'),
  new SlashCommandBuilder()
    .setName('edit_feed')
    .setDescription('Edit an existing feed')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the feed to edit')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('edit_tag')
    .setDescription('Edit an existing tag')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The name of the tag to edit')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('link_tag')
    .setDescription('Link a tag to a feed')
    .addStringOption(option =>
      option.setName('feed_name')
        .setDescription('The name of the feed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('tag_name')
        .setDescription('The name of the tag')
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('unlink_tag')
    .setDescription('Unlink a tag from a feed')
    .addStringOption(option =>
      option.setName('feed_name')
        .setDescription('The name of the feed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('tag_name')
        .setDescription('The name of the tag')
        .setRequired(true)
    ),
];

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(DISCORD_APPLICATION_ID),
      { body: commands.map(c => c.toJSON()) },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
