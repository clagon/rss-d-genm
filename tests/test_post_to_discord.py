import unittest
from unittest.mock import patch, MagicMock
from io import StringIO
import sys

# Add the script's directory to the Python path
sys.path.append('scripts')

from post_to_discord import main, get_feeds, parse_feed, filter_new_entries, send_discord_notification, update_last_posted_guid

class TestPostToDiscord(unittest.TestCase):

    @patch('sys.stdout', new_callable=StringIO)
    @patch('post_to_discord.get_feeds')
    @patch('post_to_discord.parse_feed')
    @patch('post_to_discord.send_discord_notification')
    def test_main_prints_feeds(self, mock_send_discord_notification, mock_parse_feed, mock_get_feeds, mock_stdout):
        mock_get_feeds.return_value = [
            {"id": 1, "name": "Feed 1", "url": "http://example.com/rss1", "enabled": True, "tags": [{"discord_webhook_url": "http://test.com/webhook"}]},
        ]
        mock_parse_feed.return_value = MagicMock(
            entries=[MagicMock(title="Test Title", summary="Test Summary", link="http://test.com/article1")]
        )
        with patch('post_to_discord.create_client') as mock_create_client:
            mock_supabase_client = MagicMock()
            mock_create_client.return_value = mock_supabase_client
            main()
            self.assertEqual(mock_stdout.getvalue().strip(), "New entries found for Feed 1: 1\nUpdated last_posted_guid for feed 1 to " + str(mock_parse_feed.return_value.entries[-1].guid))

    def test_get_feeds(self):
        mock_supabase_client = MagicMock()
        mock_supabase_client.table().select().eq().execute.return_value.data = [
            {"id": 1, "name": "Feed 1", "url": "http://example.com/rss1", "enabled": True},
        ]
        feeds = get_feeds(mock_supabase_client)
        self.assertEqual(len(feeds), 1)
        self.assertEqual(feeds[0]["name"], "Feed 1")

    @patch('post_to_discord.feedparser.parse')
    def test_parse_feed(self, mock_feedparser_parse):
        mock_feedparser_parse.return_value = MagicMock(
            entries=[MagicMock(title="Test Title", summary="Test Summary", link="http://test.com/article1")]
        )
        feed_url = "http://example.com/rss"
        parsed_feed = parse_feed(feed_url)
        mock_feedparser_parse.assert_called_once_with(feed_url)
        self.assertEqual(parsed_feed.entries[0].title, "Test Title")

    def test_filter_new_entries(self):
        entries = [
            MagicMock(guid="guid1", title="Title 1"),
            MagicMock(guid="guid2", title="Title 2"),
            MagicMock(guid="guid3", title="Title 3"),
        ]

        # Case 1: No last_posted_guid, all entries are new
        new_entries = filter_new_entries(entries, None)
        self.assertEqual(len(new_entries), 3)
        self.assertEqual(new_entries[0].guid, "guid1")

        # Case 2: last_posted_guid matches an existing entry
        new_entries = filter_new_entries(entries, "guid2")
        self.assertEqual(len(new_entries), 1)
        self.assertEqual(new_entries[0].guid, "guid3")

        # Case 3: last_posted_guid is the latest entry
        new_entries = filter_new_entries(entries, "guid3")
        self.assertEqual(len(new_entries), 0)

        # Case 4: No new entries
        new_entries = filter_new_entries(entries, "guid1")
        self.assertEqual(len(new_entries), 2)
        self.assertEqual(new_entries[0].guid, "guid2")
        self.assertEqual(new_entries[1].guid, "guid3")

    @patch('post_to_discord.requests.post')
    def test_send_discord_notification(self, mock_post):
        mock_post.return_value.raise_for_status = MagicMock()
        entry = MagicMock(title="Test Title", summary="Test Summary", link="http://test.com/article")
        webhook_url = "http://test.com/webhook"
        send_discord_notification(entry, webhook_url)
        mock_post.assert_called_once_with(webhook_url, json={
            "embeds": [
                {
                    "title": "Test Title",
                    "description": "Test Summary",
                    "url": "http://test.com/article"
                }
            ]
        })
        mock_post.return_value.raise_for_status.assert_called_once()

    def test_update_last_posted_guid(self):
        mock_supabase_client = MagicMock()
        feed_id = "test_feed_id"
        guid = "test_guid"
        update_last_posted_guid(mock_supabase_client, feed_id, guid)
        mock_supabase_client.table.assert_called_once_with('feeds')
        mock_supabase_client.table().update.assert_called_once_with({'last_posted_guid': guid})
        mock_supabase_client.table().update().eq.assert_called_once_with('id', feed_id)
        mock_supabase_client.table().update().eq().execute.assert_called_once()

    @patch('sys.stdout', new_callable=StringIO)
    @patch('post_to_discord.get_feeds', side_effect=Exception("Test error"))
    @patch('post_to_discord.create_client')
    def test_main_error_handling(self, mock_create_client, mock_get_feeds, mock_stdout):
        mock_supabase_client = MagicMock()
        mock_create_client.return_value = mock_supabase_client
        main()
        self.assertIn("An unexpected error occurred: Test error", mock_stdout.getvalue())

if __name__ == '__main__':
    unittest.main()