from datetime import datetime, timezone
import os
import feedparser
import requests
from supabase import create_client, Client
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from functools import reduce
from email.utils import parsedate_to_datetime

import time

# Supabase credentials
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

DISCORD_WEBHOOK_URL_RSS_LOG = os.environ.get("DISCORD_WEBHOOK_URL_RSS_LOG")

if SUPABASE_URL is None or SUPABASE_SERVICE_ROLE_KEY is None:
    Exception("creds is not set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)  # type: ignore


def post_to_discord(webhook_url, image, article, feed_name):
    username = urlparse(article.link).netloc
    avatar_url = f"https://www.google.com/s2/favicons?sz=64&domain={username}"
    if not hasattr(article, "summary"):
        article.summary = "No summary available for this article."
    soup = BeautifulSoup(article.summary, "html.parser")
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
        "avatar_url": image or avatar_url,
        "embeds": [embed],
    }
    if len(article.links) > 1 and article.links[1].type.startswith("image/png"):
        data["embeds"][0]["image"] = {"url": article.links[1].href}
    try:
        response = requests.post(webhook_url, json=data)
        time.sleep(int(response.headers.get("x-ratelimit-reset-after", 1)))
        response.raise_for_status()  # Raise an exception for HTTP errors
    except requests.exceptions.RequestException as e:
        print(response.content)
        print(f"Error posting to Discord: {e}")


def post_summary(feeds_to_post: dict):
    total_cnt = sum(len(feeds_to_post[key]) for key in feeds_to_post.keys())
    body = f""
    for tag in feeds_to_post.keys():
        if (cnt := len(feeds_to_post[tag])) > 0:
            body += f"\n{tag}：{cnt}件"
    embed = {
        "color": 65280,  # 00ff00
        "author": {
            "name": (
                f"{total_cnt}件の記事を投稿しました"
                if total_cnt > 0
                else "処理が完了しました"
            ),
        },
        "description": body,
        "timestamp": datetime.now(tz=timezone.utc).isoformat(),
    }
    data = {
        "username": "RSS Bot",
        "avatar_url": "https://cdn.discordapp.com/embed/avatars/0.png",
        "embeds": [embed],
    }
    try:
        response = requests.post(DISCORD_WEBHOOK_URL_RSS_LOG, json=data)  # type: ignore
        response.raise_for_status()  # Raise an exception for HTTP errors
        time.sleep(int(response.headers.get("x-ratelimit-reset-after", 1)))
    except requests.exceptions.RequestException as e:
        print(response.content)
        print(f"Error posting to Discord: {e}")


def main():
    print("Starting RSS to Discord bot...")
    try:

        # === 管理用変数初期化 ===
        # タグごとの送信するフィード配列
        feeds_to_post = {}

        # タグごとの送信するフィードに登録済のURL
        # 同じ記事が複数送信されるのの防止用（記事が複数フィードから配信された場合の対策）
        added_urls = {}

        # フィードごとの最終投稿記事
        last_posted_guids = {}

        #  === DBからフィード情報取得 ===
        response = (
            supabase.table("feeds")
            .select(
                "id, name, url, last_posted_guid, last_post_at, feed_tags(tags(name))"
            )
            .eq("enabled", True)
            .execute()
        )
        feeds_data = response.data

        #  === DBからタグ情報取得 ===
        response = supabase.table("tags").select("name, discord_webhook_url").execute()
        tags_data = response.data

        tag_url = {}
        for tag_entry in tags_data:
            tag_url[tag_entry["name"]] = tag_entry["discord_webhook_url"]

        if not feeds_data:
            print("No enabled feeds found.")
            return

        # === フィードごとの処理 ===
        for feed_entry in feeds_data:

            # === 初期処理 ===

            # フィードデータ取得
            feed_id = feed_entry["id"]
            feed_name = feed_entry["name"]
            feed_url = feed_entry["url"]
            last_posted_guid = feed_entry["last_posted_guid"]
            last_post_at = feed_entry["last_post_at"] and datetime.fromisoformat(
                feed_entry["last_post_at"]
            ).replace(microsecond=0)
            feed_tags = feed_entry["feed_tags"]

            # 配列初期化
            for feed_tag in feed_tags:
                if feeds_to_post.get(feed_tag["tags"]["name"]) is None:
                    feeds_to_post[feed_tag["tags"]["name"]] = []
                    added_urls[feed_tag["tags"]["name"]] = set()

            print(f"======\n{feed_name} ({feed_url})\n------")

            # === フィードのパース ===
            try:
                parsed_feed = feedparser.parse(feed_url, sanitize_html=False)
            except Exception as e:
                print(f"Error parsing feed {feed_name}: {e}")
                continue

            # === 新着記事取得 ===
            new_articles: list[feedparser.FeedParserDict] = []
            entries = sorted(
                parsed_feed.entries, key=lambda x: x.published_parsed, reverse=True
            )

            for entry in entries:
                # if entry.guid == last_posted_guid:
                #     break
                try:
                    published_at = parsedate_to_datetime(entry.published)  # type: ignore
                except:
                    published_at = datetime(*entry.published_parsed[:7], tzinfo=timezone.utc)  # type: ignore

                if last_post_at and published_at.replace(microsecond=0) <= last_post_at:
                    break
                new_articles.append(entry)

            if new_articles:
                print(f"Found {len(new_articles)} new articles for {feed_name}.")

                last_posted_guids[feed_id] = {
                    "guid": new_articles[0].guid,
                    "time": new_articles[0].published_parsed[:7],
                }

                # === 投稿 ===
                for article in new_articles:
                    for tag_info in feed_tags:
                        if article.link in added_urls[feed_tag["tags"]["name"]]:
                            continue
                        feeds_to_post[tag_info["tags"]["name"]].append(
                            {
                                "article": article,
                                "image": (
                                    parsed_feed.image.href  # type: ignore
                                    if hasattr(parsed_feed, "image")
                                    else None
                                ),
                                "feed_name": feed_name,
                            }
                        )
                        added_urls[feed_tag["tags"]["name"]].add(article.link)
            else:
                print(f"No new articles for {feed_name}.")

        # === 記事をdiscordに投稿 ===s
        print(
            "======\n======\nStart Posting..."
            if sum(len(feeds_to_post[key]) for key in feeds_to_post.keys()) > 0
            else "======\n======\nNo New Post Found"
        )
        # タグごとに投稿
        for tag in feeds_to_post.keys():
            # 記事の投稿日時でソート
            articles = sorted(
                feeds_to_post[tag],
                key=lambda x: x["article"].published_parsed,
            )
            for article in articles:
                # 記事投稿
                post_to_discord(
                    tag_url[tag],
                    article["image"],
                    article["article"],
                    article["feed_name"],
                )
                print(f"Posted article '{article['article'].guid}' to {tag}.")

        # === 最終投稿記事の更新
        for feed_id in last_posted_guids.keys():

            new_last_posted_guid = last_posted_guids[feed_id]

            # 最終投稿IDを更新
            update_response = (
                supabase.table("feeds")
                .update(
                    {
                        "last_posted_guid": new_last_posted_guid["guid"],
                        "updated_at": datetime.now(tz=timezone.utc).isoformat(),
                        "last_post_at": datetime(
                            *new_last_posted_guid["time"]
                        ).isoformat(),
                    }
                )
                .eq("id", feed_id)
                .execute()
            )

            if update_response.data:
                print(
                    f"Updated last_posted_guid for {article["feed_name"]} to {new_last_posted_guid["guid"]}"
                )
            else:
                print(f"Failed to update last_posted_guid for {article["feed_name"]}")

        # === サマリー投稿 ===
        post_summary(feeds_to_post)

    except Exception as e:
        print(f"An unexpected error occurred: {e}")


if __name__ == "__main__":
    main()
