from datetime import datetime
import os
import feedparser
import requests
from supabase import create_client, Client
from urllib.parse import urlparse
from bs4 import BeautifulSoup

# Supabase credentials
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def post_to_discord(webhook_url, feed, article, feed_name):
    username = urlparse(article.link).netloc
    avatar_url = f"https://www.google.com/s2/favicons?sz=64&domain={username}"
    soup = BeautifulSoup(article.summary, 'html.parser')
    date = datetime(*article.published_parsed[:7])
    embed = {
        "color": 5814783,  # Discord embed color (e.g., blue)
        "author": {
            "name": article.title,
            "url": article.link,
        },
        "description": soup.get_text(),
        "footer": {"text": feed_name, "icon_url": avatar_url},
        "timestamp": date.isoformat(),
    }
    data = {
        "username": username,
        "avatar_url": feed.image.href if hasattr(feed, 'image') else avatar_url,
        "embeds": [embed]
    }
    if len(article.links) > 1 and article.links[1].type.startswith("image/png"):
        data["embeds"][0]["image"] = {
            "url": article.links[1].href
        }
    try:
        response = requests.post(webhook_url, json=data)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        print(response.content)
        print(f"Error posting to Discord: {e}")


def main():
    print("Starting RSS to Discord bot...")
    try:
        # Fetch enabled feeds and their associated tags
        # Using rpc to call a stored procedure that joins feeds and tags
        # Or, fetch feeds and then tags separately and join in Python
        # For simplicity, let's fetch feeds and then their tags
        response = supabase.table('feeds').select(
            'id, name, url, last_posted_guid, feed_tags(tags(name, discord_webhook_url))').eq('enabled', True).execute()
        feeds_data = response.data

        if not feeds_data:
            print("No enabled feeds found.")
            return

        for feed_entry in feeds_data:
            feed_id = feed_entry['id']
            feed_name = feed_entry['name']
            feed_url = feed_entry['url']
            last_posted_guid = feed_entry['last_posted_guid']
            feed_tags = feed_entry['feed_tags']

            print(f"Processing feed: {feed_name} ({feed_url})")

            try:
                parsed_feed = feedparser.parse(feed_url, sanitize_html=False)
            except Exception as e:
                print(f"Error parsing feed {feed_name}: {e}")
                continue

            new_articles: list[feedparser.FeedParserDict] = []
            for entry in reversed(parsed_feed.entries):
                if entry.guid == last_posted_guid:
                    break
                new_articles.append(entry)

            if new_articles:
                print(
                    f"Found {len(new_articles)} new articles for {feed_name}.")
                for article in new_articles:
                    for tag_info in feed_tags:
                        webhook_url = tag_info['tags']['discord_webhook_url']
                        post_to_discord(
                            webhook_url, parsed_feed,  article, feed_name)
                        print(
                            f"Posted article '{article.guid}' to {tag_info['tags']['name']}.")
                    break

                # Update last_posted_guid
                new_last_posted_guid = new_articles[-1].guid
                update_response = supabase.table('feeds').update(
                    {'last_posted_guid': new_last_posted_guid}).eq('id', feed_id).execute()
                if update_response.data:
                    print(
                        f"Updated last_posted_guid for {feed_name} to {new_last_posted_guid}")
                else:
                    print(
                        f"Failed to update last_posted_guid for {feed_name}")

            else:
                print(f"No new articles for {feed_name}.")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    main()
