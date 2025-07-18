import unittest
from unittest.mock import patch
from io import StringIO
import sys

# Add the script's directory to the Python path
sys.path.append('scripts')

from post_to_discord import main

class TestPostToDiscord(unittest.TestCase):

    @patch('sys.stdout', new_callable=StringIO)
    def test_main_prints_hello_world(self, mock_stdout):
        main()
        self.assertEqual(mock_stdout.getvalue().strip(), "Hello World!")

if __name__ == '__main__':
    unittest.main()