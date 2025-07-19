import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
  const { data: tags, error } = await supabase.from('tags').select('*');

  if (error) {
    console.error('Error loading tags:', error.message);
    return { tags: [] };
  }

  return { tags };
};