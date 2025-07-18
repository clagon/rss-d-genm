import { serverSupabaseClient } from '#supabase/server';

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { data, error } = await client
    .from('feeds')
    .select('*, tags(*)')
    .eq('enabled', true);

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }

  return data;
});
