CREATE TABLE users (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    discord_id text UNIQUE NOT NULL,
    username text NOT NULL,
    avatar_url text,
    role text NOT NULL DEFAULT 'user',
    created_at timestamptz NOT NULL DEFAULT now()
);
