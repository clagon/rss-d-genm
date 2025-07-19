import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  const client = serverSupabaseClient(event);

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const { data, error } = await client
    .from('feeds')
    .select('*, tags(*)')
    .eq('enabled', true);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
