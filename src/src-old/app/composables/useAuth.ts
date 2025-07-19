import { ref } from 'vue';
import { useSupabaseUser, useSupabaseClient } from '#imports';

export const useAuth = () => {
  const user = useSupabaseUser();
  const client = useSupabaseClient();
  const isAdmin = ref(false);

  const checkAdminStatus = async () => {
    if (user.value) {
      const { data, error } = await client
        .from('users')
        .select('role')
        .eq('id', user.value.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        isAdmin.value = false;
      } else if (data && data.role === 'admin') {
        isAdmin.value = true;
      } else {
        isAdmin.value = false;
      }
    } else {
      isAdmin.value = false;
    }
  };

  // Initial check and re-check on user change
  watch(user, checkAdminStatus, { immediate: true });

  return {
    user,
    isAdmin,
    checkAdminStatus,
  };
};
