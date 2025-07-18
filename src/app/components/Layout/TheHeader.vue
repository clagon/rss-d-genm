<template>
  <header>
    <UContainer class="flex justify-between items-center py-4">
      <NuxtLink to="/" class="text-xl font-bold">RSS Discord Bot</NuxtLink>
      <nav>
        <ul class="flex space-x-4">
          <li><NuxtLink to="/feeds" active-class="text-primary">Feeds</NuxtLink></li>
          <li><NuxtLink to="/admin/feeds" active-class="text-primary">Admin Feeds</NuxtLink></li>
          <li><NuxtLink to="/admin/tags" active-class="text-primary">Admin Tags</NuxtLink></li>
        </ul>
      </nav>
    </UContainer>
  </header>
</template>
