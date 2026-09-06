-- PostgREST (anon/authenticated) からの直アクセスを全面禁止する。
-- アプリは SvelteKit / discord-bot ともに DATABASE_URL 直結（postgres ロール = BYPASSRLS）なので影響なし。
-- ポリシーは意図的に 1 つも作らない = 全拒否。
ALTER TABLE public.feeds        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feed_tags    ENABLE ROW LEVEL SECURITY;
-- Better Auth のテーブル。account は access_token / refresh_token / password を持つ。
ALTER TABLE public."user"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification ENABLE ROW LEVEL SECURITY;
