<template>
  <span
    class="loading-spinner"
    :class="{ inline, fullscreen }"
    :style="{ '--spinner-size': size + 'px' }"
    role="status"
    :aria-label="label"
  >
    <span class="spinner-ring" aria-hidden="true"></span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label?: string;
  size?: number;
  inline?: boolean;
  fullscreen?: boolean;
}>(), {
  label: 'Chargement…',
  size: 36,
  inline: false,
  fullscreen: false,
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.loading-spinner.inline {
  display: inline-flex;
  flex-shrink: 0;
  padding: 0;
  vertical-align: middle;
}
.loading-spinner.fullscreen {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--app-background);
}
.spinner-ring {
  width: var(--spinner-size);
  height: var(--spinner-size);
  border: 3px solid var(--spinner-track, var(--app-primary10));
  border-top-color: var(--spinner-color, var(--app-primary));
  border-radius: 50%;
  animation: spinner-rotate .8s linear infinite;
}
@keyframes spinner-rotate {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .spinner-ring { animation: none; }
}
</style>
