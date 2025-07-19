export default defineNuxtRouteMiddleware((to, _) => {
  const user = useSupabaseUser();
  console.log(user.value);
  if (!user.value && to.path !== '/login') {
    return navigateTo('/login');
  }
});
