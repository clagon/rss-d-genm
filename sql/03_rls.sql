 -- get_user_role 関数
 CREATE OR REPLACE FUNCTION
     get_user_role(user_id uuid)
 RETURNS text AS $$
     SELECT role FROM public.users WHERE
     id = user_id;
 $$ LANGUAGE sql SECURITY DEFINER;

 -- users テーブル
 DROP POLICY IF EXISTS "Allow all" ON
      public.users;
 CREATE POLICY "Users can view their own
      data" ON public.users FOR SELECT USING
      (auth.uid() = id);
 CREATE POLICY "Users can update their
      own data" ON public.users FOR UPDATE
      USING (auth.uid() = id);
 CREATE POLICY "Users can insert their
      own data" ON public.users FOR INSERT
      WITH CHECK (auth.uid() = id);
 CREATE POLICY "Users can delete their
      own data" ON public.users FOR DELETE
      USING (auth.uid() = id);
 
 -- feeds テーブル
 DROP POLICY IF EXISTS "Allow all" ON
      public.feeds;
 CREATE POLICY "Admins can manage feeds"
      ON public.feeds FOR ALL USING
      (get_user_role(auth.uid()) = 'admin')
      WITH CHECK (get_user_role(auth.uid()) =
      'admin');
 CREATE POLICY "All users can view feeds"
      ON public.feeds FOR SELECT USING (true);
 
 -- tags テーブル
 DROP POLICY IF EXISTS "Allow all" ON
      public.tags;
 CREATE POLICY "Admins can manage tags"
      ON public.tags FOR ALL USING
      (get_user_role(auth.uid()) = 'admin')
      WITH CHECK (get_user_role(auth.uid()) = 'admin');
 CREATE POLICY "All users can view tags"
      ON public.tags FOR SELECT USING (true);
 
 -- feed_tags テーブル
 DROP POLICY IF EXISTS "Allow all" ON
      public.feed_tags;
 CREATE POLICY "Admins can manage
      feed_tags" ON public.feed_tags FOR ALL
      USING (get_user_role(auth.uid()) =
      'admin') WITH CHECK
      (get_user_role(auth.uid()) = 'admin');
 CREATE POLICY "All users can view
      feed_tags" ON public.feed_tags FOR
      SELECT USING (true);
