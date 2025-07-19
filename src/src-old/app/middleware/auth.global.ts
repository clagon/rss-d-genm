export default defineNuxtRouteMiddleware((to, _) => {
  const user = useSupabaseUser();
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login');
  }
});
