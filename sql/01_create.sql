-- users テーブル
   2 CREATE TABLE users (
   3     id uuid PRIMARY KEY REFERENCES
     auth.users(id),
   4     discord_id TEXT UNIQUE NOT NULL,
   5     username TEXT NOT NULL,
   6     avatar_url TEXT,
   7     role TEXT NOT NULL DEFAULT 'user',
   8     created_at TIMESTAMPTZ NOT NULL
     DEFAULT now()
   9 );

  次に feeds テーブルを作成します。

    1 -- feeds テーブル
    2 CREATE TABLE feeds (
    3     id UUID PRIMARY KEY DEFAULT
      gen_random_uuid(),
    4     name TEXT NOT NULL,
    5     url TEXT NOT NULL UNIQUE,
    6     enabled BOOLEAN NOT NULL DEFAULT
      true,
    7     last_posted_guid TEXT,
    8     created_at TIMESTAMPTZ NOT NULL
      DEFAULT now(),
    9     updated_at TIMESTAMPTZ NOT NULL
      DEFAULT now()
   10 );

  次に tags テーブルを作成します。

   1 -- tags テーブル
   2 CREATE TABLE tags (
   3     id UUID PRIMARY KEY DEFAULT
     gen_random_uuid(),
   4     name TEXT NOT NULL UNIQUE,
   5     discord_channel_id TEXT,
   6     discord_webhook_url TEXT NOT NULL,
   7     created_at TIMESTAMPTZ NOT NULL
     DEFAULT now(),
   8     updated_at TIMESTAMPTZ NOT NULL
     DEFAULT now()
   9 );

  最後に中間テーブル feed_tags を作成します。

   1 -- feed_tags テーブル
   2 CREATE TABLE feed_tags (
   3     feed_id UUID REFERENCES feeds(id)
     ON DELETE CASCADE,
   4     tag_id UUID REFERENCES tags(id) ON
     DELETE CASCADE,
   5     PRIMARY KEY (feed_id, tag_id)
   6 );