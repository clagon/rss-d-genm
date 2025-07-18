import unittest
from unittest.mock import patch, MagicMock
from io import StringIO
import sys

# Add the script's directory to the Python path
sys.path.append('scripts')

from post_to_discord import main, get_feeds, parse_feed

class TestPostToDiscord(unittest.TestCase):

    @patch('sys.stdout', new_callable=StringIO)
    @patch('post_to_discord.get_feeds')
    @patch('post_to_discord.parse_feed')
    def test_main_prints_feeds(self, mock_parse_feed, mock_get_feeds, mock_stdout):
        mock_get_feeds.return_value = [
            {"id": 1, "name": "Feed 1", "url": "http://example.com/rss1", "enabled": True},
        ]
        mock_parse_feed.return_value = MagicMock(
            entries=[MagicMock(title="Test Title", summary="Test Summary", link="http://test.com/article1")]
        )
        with patch('post_to_discord.create_client') as mock_create_client:
            mock_supabase_client = MagicMock()
            mock_create_client.return_value = mock_supabase_client
            main()
            self.assertEqual(mock_stdout.getvalue().strip(), "Parsed feed Feed 1: Test Title")

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

if __name__ == '__main__':
    unittest.main()