<template>
  <div
    class="manager-shell"
    :style="theme"
  >
    <aside class="sidebar">
      <AppLogo />
      <ManagerNavigation />
    </aside>
    <dialog
      ref="drawer"
      class="drawer"
      @click="backdrop"
      @close="restore"
      @cancel.prevent="close"
    >
      <div class="drawer-head">
        <AppLogo />
      </div>
      <ManagerNavigation @navigate="close" />
    </dialog>
    <div class="manager-main">
      <header class="topbar">
        <button
          class="menu"
          aria-label="Ouvrir le menu"
          @click="show"
        >
          <i class="fi fi-rr-bars-sort" />
        </button>
        <div>
          <h1>{{ title }}</h1>
          <p>Votre espace QuickPick.</p>
        </div>
        <button
          class="bell"
          aria-label="Notifications"
          @click="showToast('Aucune nouvelle notification.')"
        >
          <i class="fi fi-rr-bell" />
        </button>
      </header>
      <main><slot /></main>
      <AssistanceButton />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import AssistanceButton from '../other/AssistanceButton.vue';
import AppLogo from '../other/AppLogo.vue';
import ManagerNavigation from './ManagerNavigation.vue';
import { AppColors } from '../../constants/app_colors';
import { useToast } from '../../shared/useToast';
defineProps<{ title: string }>();
const { showToast } = useToast();
const drawer = ref<HTMLDialogElement>();
let previous: string | null = null;
let closing = false;
let closingAnimation: Animation | undefined;
const theme = {
  '--manager-navy': AppColors.navy,
  '--manager-bg': AppColors.background,
  '--manager-text': AppColors.textPrimary,
  '--manager-primary': AppColors.primary,
  '--manager-muted': AppColors.textSecondary,
  '--manager-border': AppColors.border,
};
function show() {
  if (drawer.value?.open) return;
  previous = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  drawer.value?.showModal();
}
function restore() {
  if (previous !== null) {
    document.documentElement.style.overflow = previous;
    previous = null;
  }
}
async function close() {
  const panel = drawer.value;
  if (!panel?.open || closing) return;

  closing = true;
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    closingAnimation = panel.animate(
      [{ transform: getComputedStyle(panel).transform }, { transform: 'translateX(-100%)' }],
      { duration: 250, easing: 'ease-in', fill: 'forwards' },
    );
    await closingAnimation.finished.catch(() => {});
  }

  panel.close();
  closingAnimation?.cancel();
  closingAnimation = undefined;
  closing = false;
  restore();
}
function backdrop(e: MouseEvent) {
  if (e.target === drawer.value) {
    const r = drawer.value.getBoundingClientRect();
    if (e.clientX > r.right) close();
  }
}
onBeforeUnmount(() => {
  closingAnimation?.cancel();
  restore();
});
</script>
<style scoped>
.manager-shell {
  min-height: 100dvh;
  background: radial-gradient(ellipse at 90% 5%, var(--app-primaryAlpha12), var(--app-transparent) 45%), var(--manager-bg);
  color: var(--manager-text);
  font-family: Inter, sans-serif;
}
.sidebar,
.drawer {
  background: linear-gradient(165deg, var(--app-navyLight), var(--app-navyDark));
  padding: 32px 20px;
  flex-direction: column;
  gap: 30px;
}
.sidebar {
  display: flex;
  position: fixed;
  inset: 0 auto 0 0;
  width: 250px;
  overflow: auto;
}
.manager-main {
  margin-left: 250px;
}
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 30px;
  background: var(--app-backgroundLightAlphaEE);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--app-border);
}
.topbar h1 {
  font-size: 18px;
  margin: 0;
}
.topbar p {
  font-size: 11px;
  color: var(--app-textSecondary);
  margin: 5px 0 0;
}
.topbar button {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
}
.bell {
  margin-left: auto;
}
.topbar .menu {
  display: none;
}
main {
  padding: 30px 30px 100px;
}
.drawer {
  position: fixed;
  inset: 0 auto 0 0;
  margin: 0;
  width: min(290px, 85vw);
  height: 100dvh;
  max-height: none;
  border: 0;
  color: var(--app-surface);
}
.drawer[open] {
  display: flex;
  animation: drawer-in 0.25s ease-out;
}
.drawer::backdrop {
  background: var(--app-navyDarkAlpha88);
}
.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
@keyframes drawer-in {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
@media (max-width: 850px) {
  .sidebar {
    display: none;
  }
  .manager-main {
    margin-left: 0;
  }
  .topbar {
    padding: 14px 17px;
  }
  .topbar .menu {
    display: grid;
  }
  main {
    padding: 20px 17px 100px;
  }
  .topbar h1 {
    font-size: 16px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .drawer[open] {
    animation: none;
  }
}
</style>
