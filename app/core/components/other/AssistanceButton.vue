<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from '#imports';

const isOpen = ref(false);
const route = useRoute();
const actions = [
  { name: 'Messenger', icon: '/asset/image/icon/messenger.png', href: 'https://www.facebook.com/share/1CLrUga4vw/' },
  // Lien fictif à remplacer par le profil LinkedIn.
  { name: 'LinkedIn', icon: '/asset/image/icon/linkedin.png', href: 'https://www.linkedin.com/in/light-ning/' },
  { name: 'WhatsApp', icon: 'https://i.postimg.cc/VkDfjJNh/whatsapp-(1).png', href: 'https://wa.me/22891110074' },
];
watch(() => route.fullPath, () => { isOpen.value = false; });
</script>

<template>
  <div class="assistance-contact">
    <Transition name="fade">
      <div v-if="isOpen" class="assistance-backdrop" @click="isOpen = false" />
    </Transition>
    <div class="assistance-menu" :class="{ 'is-open': isOpen }" :inert="!isOpen">
      <a v-for="action in actions" :key="action.name" class="assistance-action"
        :href="action.href" target="_blank" rel="noopener noreferrer"
        :aria-label="action.name + ' (nouvel onglet)'" @click="isOpen = false">
        <img :src="action.icon" alt="" />
        <span class="assistance-label">{{ action.name }}</span>
      </a>
    </div>
    <button type="button" class="assistance-trigger" :class="{ 'is-open': isOpen }"
      :aria-expanded="isOpen" :aria-label="isOpen ? 'Fermer l’assistance' : 'Ouvrir l’assistance'"
      @click="isOpen = !isOpen">
      <span v-if="isOpen" class="assistance-close" aria-hidden="true"></span>
      <template v-else>
        <img src="/asset/image/icon/support-service.png" alt="" />
        <span>Assistance</span>
      </template>
    </button>
  </div>
</template>

<style scoped>
.assistance-contact {
  position: fixed;
  bottom: max(22px, env(safe-area-inset-bottom));
  right: 22px;
  z-index: 25;
  width: 70px;
  height: 70px;
}
.assistance-backdrop {
  position: fixed;
  inset: 0;
  background: var(--app-black20);
  backdrop-filter: blur(2px);
}
.assistance-trigger,
.assistance-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--app-surface);
  color: var(--app-textPrimary);
  box-shadow: 0 5px 20px var(--app-navyAlpha20);
  cursor: pointer;
}
.assistance-trigger {
  position: relative;
  width: 70px;
  height: 70px;
  border: none;
  border-radius: 22px;
  background: var(--app-primary);
  color: var(--app-textOnPrimary);
  animation: pulse 3s ease-out infinite;
  transition: border-radius 0.3s, background 0.3s;
}
.assistance-trigger.is-open {
  background: var(--app-primary);
  color: var(--app-textOnPrimary);
  border-radius: 18px;
  animation: none;
}
.assistance-trigger img {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
.assistance-trigger span {
  font-size: 10px;
  font-weight: 700;
}
.assistance-trigger .assistance-close {
  position: relative;
  width: 24px;
  height: 24px;
}
.assistance-close::before,
.assistance-close::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 2px;
  border-radius: 1px;
  background: currentColor;
  transform: translate(-50%, -50%) rotate(45deg);
}
.assistance-close::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}
.assistance-menu {
  position: absolute;
  inset: 0;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s, visibility 0.3s;
}
.assistance-menu.is-open {
  visibility: visible;
  opacity: 1;
}
.assistance-action {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 60px;
  height: 60px;
  gap: 5px;
  border-radius: 20px;
  text-decoration: none;
  transition: transform 0.35s ease-out;
}
.assistance-action img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.assistance-label {
  font-size: 9px;
  font-weight: 600;
  line-height: 12px;
  color: var(--app-textPrimary);
  text-align: center;
  white-space: nowrap;
}
.assistance-menu.is-open .assistance-action:nth-child(1) { transform: translate(0, -110px); }
.assistance-menu.is-open .assistance-action:nth-child(2) { transform: translate(-80px, -80px); }
.assistance-menu.is-open .assistance-action:nth-child(3) { transform: translate(-110px, 0); }
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
@keyframes pulse {
  0%,
  65%,
  100% {
    box-shadow:
      0 5px 20px var(--app-navyAlpha20),
      0 0 0 0 transparent;
  }
  20% {
    box-shadow:
      0 5px 20px var(--app-navyAlpha20),
      0 0 0 10px var(--app-primary20);
  }
  45% {
    box-shadow:
      0 5px 20px var(--app-navyAlpha20),
      0 0 0 18px transparent;
  }
}
@media (prefers-reduced-motion: reduce) {
  .assistance-trigger { animation: none; }
  .assistance-trigger,
  .assistance-menu,
  .assistance-action,
  .fade-enter-active,
  .fade-leave-active { transition: none; }
}
</style>
