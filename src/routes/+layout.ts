import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ data, depends }) => {
  depends('supabase:auth')

  const { supabase, session } = data

  const isAdmin = async () => {
    if (session?.user) {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching user role:', error)
        return false
      }
      return data?.role === 'admin'
    }
    return false
  }

  return {
    supabase,
    session,
    isAdmin: await isAdmin(),
  }
}
