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
    print("Feeds:", feeds)


if __name__ == "__main__":
    main()
