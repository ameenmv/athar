<template>
  <div>
    <nav class="nav-bar">
      <div class="nav-inner">
        <NuxtLink to="/" class="nav-logo">
          <span class="logo-icon">🔮</span>
          <span>Athar</span>
          <span class="logo-arabic">أثر</span>
        </NuxtLink>
        <ul class="nav-links">
          <li><NuxtLink to="/">📊 Dashboard</NuxtLink></li>
          <li><NuxtLink to="/lessons">📚 Lessons</NuxtLink></li>
        </ul>
      </div>
    </nav>
    <main class="app-container">
      <NuxtPage />
    </main>
  </div>
</template>

<style>
@import '~/assets/css/main.css';
</style>
