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
        else:
            print(f"No new entries for {feed['name']}")

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
