-- users テーブル
CREATE TABLE
    users (
        id uuid PRIMARY KEY REFERENCES auth.users (id)
      , discord_id TEXT UNIQUE NOT NULL
      , username TEXT NOT NULL
      , avatar_url TEXT
      , role TEXT NOT NULL DEFAULT 'user'
      , created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

-- feeds テーブル
CREATE TABLE
    feeds (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid ()
      , name TEXT NOT NULL
      , url TEXT NOT NULL UNIQUE
      , enabled BOOLEAN NOT NULL DEFAULT TRUE
      , last_posted_guid TEXT
      , created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
      , updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

-- tags テーブル
CREATE TABLE
    tags (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid ()
      , name TEXT NOT NULL UNIQUE
      , discord_channel_id TEXT
      , discord_webhook_url TEXT NOT NULL
      , created_at TIMESTAMPTZ NOT NULL DEFAULT now ()
      , updated_at TIMESTAMPTZ NOT NULL DEFAULT now ()
    );

-- feed_tags テーブル
CREATE TABLE
    feed_tags (
        feed_id UUID REFERENCES feeds (id) ON DELETE CASCADE
      , tag_id UUID REFERENCES tags (id) ON DELETE CASCADE
      , PRIMARY KEY (feed_id, tag_id)
    );