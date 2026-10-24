<template>
  <div>
    <NuxtRouteAnnouncer />
    
     <NuxtPage />
  </div>
 
</template>

<script setup lang="ts">
import { useHead } from '#imports';
import { AppColors } from './core/constants/app_colors';


useHead({
  style: [{
    key: 'app-colors',
    textContent: ':root {' + Object.entries(AppColors)
      .map(([name, value]) => '--app-' + name + ': ' + value + ';')
      .join('') + '}',
  }],
});
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}

button,
a,
[role="button"],
input[type="button"],
input[type="submit"],
input[type="reset"],
.menu-item {
  -webkit-tap-highlight-color: var(--app-transparent);
}

html {
  font-family: 'Inter', sans-serif;
}

body {
  margin: 0;
  font-family: inherit;
}

button,
input,
select,
textarea {
  font-family: inherit;
}

/* Shared scrollbar styling, with a fallback for WebKit browsers. */
html {
  scrollbar-color: var(--app-primaryLight) var(--app-background);
  scrollbar-width: thin;
}

* {
  scrollbar-width: thin;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--app-background);
}

::-webkit-scrollbar-thumb {
  background: var(--app-primaryLight);
  border: 2px solid var(--app-background);
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--app-primary);
}

@media (forced-colors: active) {
  html,
  * {
    scrollbar-color: auto;
    scrollbar-width: auto;
  }
}
</style>