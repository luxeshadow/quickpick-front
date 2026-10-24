<template>
  <span class="skeleton-media" aria-hidden="true"></span>
</template>

<style scoped>
.skeleton-media {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  pointer-events: none;
  background: linear-gradient(100deg, var(--app-borderNeutral) 30%, var(--app-surfacePale) 45%, var(--app-borderNeutral) 60%);
  background-size: 220% 100%;
  animation: shimmer 1.3s ease-in-out infinite;
}

@keyframes shimmer {
  from { background-position: 100% 0; }
  to { background-position: -100% 0; }
}

@media (max-width: 640px) {
  .skeleton-media { border-radius: 3px; }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-media { animation: none; }
}
</style>