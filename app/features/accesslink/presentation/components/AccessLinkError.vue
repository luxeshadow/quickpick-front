<template>
  <section class="access-error" role="alert">
    <div class="access-error-content">
      <span class="access-error-icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
          <rect x="5" y="10" width="14" height="11" rx="3" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
        </svg>
      </span>
      <p>{{ message }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{ message: string }>();
</script>

<style scoped>
.access-error {
  min-height: 100vh;
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--app-background);
}
.access-error-content {
  max-width: 420px;
  text-align: center;
}
.access-error-icon {
  display: inline-grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 22px;
  background: var(--app-infoLight);
  color: var(--app-primary);
}
p {
  margin: 20px 0 0;
  color: var(--app-textPrimary);
  font-size: 16px;
  line-height: 1.7;
}
</style>
