<template>
  <picture class="app-logo">
    <source media="(max-width: 640px)" :srcset="AppImages.logoMobile" />
    <img :src="AppImages.logo" alt="QuickPick" />
  </picture>
</template>

<script setup lang="ts">
import { AppImages } from '../../constants/app_images';
</script>

<style scoped>
.app-logo {
  display: block;
  flex-shrink: 0;
  align-self: flex-start;
  width: fit-content;
  max-width: 100%;
  overflow: hidden;
  border-radius: 12px;
  vertical-align: middle;
}
.app-logo img {
  display: block;
  width: auto;
  height: auto;
  max-width: 140px;
  max-height: 50px;
  object-fit: contain;
}
@media (max-width: 640px) {
  .app-logo img { max-width: 120px; }
}
</style>
