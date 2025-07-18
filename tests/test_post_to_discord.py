import unittest
from unittest.mock import patch, MagicMock
from io import StringIO
import sys

# Add the script's directory to the Python path
sys.path.append('scripts')

from post_to_discord import main, get_feeds

class TestPostToDiscord(unittest.TestCase):

    @patch('sys.stdout', new_callable=StringIO)
    @patch('post_to_discord.get_feeds')
    def test_main_prints_feeds(self, mock_get_feeds, mock_stdout):
        mock_get_feeds.return_value = [
            {"id": 1, "name": "Feed 1", "url": "http://example.com/rss1", "enabled": True},
        ]
        with patch('post_to_discord.create_client') as mock_create_client:
            mock_supabase_client = MagicMock()
            mock_create_client.return_value = mock_supabase_client
            main()
            self.assertEqual(mock_stdout.getvalue().strip(), "Feeds: [{'id': 1, 'name': 'Feed 1', 'url': 'http://example.com/rss1', 'enabled': True}]")

    def test_get_feeds(self):
        mock_supabase_client = MagicMock()
        mock_supabase_client.table().select().eq().execute.return_value.data = [
            {"id": 1, "name": "Feed 1", "url": "http://example.com/rss1", "enabled": True},
        ]
        feeds = get_feeds(mock_supabase_client)
        self.assertEqual(len(feeds), 1)
        self.assertEqual(feeds[0]["name"], "Feed 1")

if __name__ == '__main__':
    unittest.main()