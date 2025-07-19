import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: feeds, error } = await supabase
    .from('feeds')
    .select('*, tags(*)');

  if (error) {
    console.error('Error loading feeds:', error.message);
    return { feeds: [] };
  }

  return { feeds };
};