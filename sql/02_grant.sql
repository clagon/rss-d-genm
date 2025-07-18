-- users テーブル
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.users FOR ALL USING (TRUE)
WITH
    CHECK (TRUE);

-- feeds テーブル
ALTER TABLE public.feeds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.feeds FOR ALL USING (TRUE)
WITH
    CHECK (TRUE);

-- tags テーブル
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.tags FOR ALL USING (TRUE)
WITH
    CHECK (TRUE);

-- feed_tags テーブル
ALTER TABLE public.feed_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.feed_tags FOR ALL USING (TRUE)
WITH
    CHECK (TRUE);