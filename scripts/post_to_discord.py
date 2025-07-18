#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
import feedparser
import requests
from supabase import create_client, Client


def get_feeds(client: Client):
    response = client.table('feeds').select('*').eq('enabled', True).execute()
    return response.data


def main():
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    supabase_client = create_client(supabase_url, supabase_key)
    feeds = get_feeds(supabase_client)
    for feed in feeds:
        parsed_feed = parse_feed(feed["url"])
        new_entries = filter_new_entries(parsed_feed.entries, feed.get("last_posted_guid"))
        if new_entries:
            print(f"New entries found for {feed['name']}: {len(new_entries)}")
            for entry in new_entries:
                send_discord_notification(entry, feed["tags"][0]["discord_webhook_url"])
            update_last_posted_guid(supabase_client, feed["id"], new_entries[-1].guid)
        else:
            print(f"No new entries for {feed['name']}")

def update_last_posted_guid(client: Client, feed_id: str, guid: str):
    client.table('feeds').update({'last_posted_guid': guid}).eq('id', feed_id).execute()
    print(f"Updated last_posted_guid for feed {feed_id} to {guid}")

def send_discord_notification(entry, webhook_url):
    message = {
        "embeds": [
            {
                "title": entry.title,
                "description": entry.summary,
                "url": entry.link
            }
        ]
    }
    response = requests.post(webhook_url, json=message)
    response.raise_for_status() # Raise an exception for HTTP errors
    print(f"Notification sent for {entry.title}")

def filter_new_entries(entries, last_posted_guid):
    if not last_posted_guid:
        return entries

    new_entries = []
    # Find the index of the last_posted_guid
    try:
        last_posted_index = next(i for i, entry in enumerate(entries) if entry.guid == last_posted_guid)
        # All entries after last_posted_guid are new
        new_entries = entries[last_posted_index + 1:]
    except StopIteration:
        # last_posted_guid not found, assume all entries are new
        new_entries = entries

    return new_entries

def parse_feed(feed_url: str):
    return feedparser.parse(feed_url)


if __name__ == "__main__":
    main()
