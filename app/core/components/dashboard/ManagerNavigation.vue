<template>
  <nav aria-label="Navigation manager">
    <template
      v-for="group in visibleGroups"
      :key="group.label"
    >
      <span
        class="label"
        :class="{ account: group.label === 'Compte' }"
      >
        {{ group.label }}
      </span>
      <NuxtLink
        v-for="item in group.items"
        :key="item.path"
        :to="item.path"
        :class="{ active: isActive(item.path) }"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="$emit('navigate')"
      >
        <i
          :class="'fi fi-rr-' + item.icon"
          aria-hidden="true"
        />
        {{ item.label }}
      </NuxtLink>
    </template>
  </nav>

  <button
    class="logout"
    type="button"
    :disabled="loggingOut"
    @click="logout"
  >
    <LoadingSpinner v-if="loggingOut" inline :size="18" label="Déconnexion en cours" class="logout-loading" />
    <i
      v-else
      class="fi fi-rr-sign-out-alt"
      aria-hidden="true"
    />
    {{ loggingOut ? 'Déconnexion…' : 'Déconnexion' }}
  </button>
</template>

<script setup lang="ts">
import LoadingSpinner from '../other/LoadingSpinner.vue';
import { useAuthStore } from '../../../features/auth/presentation/store/auth_store';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter, useState } from '#imports';
import { Failure } from '../../error/failure';
import { useToast } from '../../shared/useToast';
import { LogoutUseCase } from '../../../features/auth/application/usecases/logout_usecase';
import { LogoutRepositoryImpl } from '../../../features/auth/data/repositories/logout_repository_impl';

const router = useRouter();
const { showToast } = useToast();
const authStore = useAuthStore();
const { session } = storeToRefs(authStore);
const { clearSession } = authStore;
const logoutUseCase = new LogoutUseCase(new LogoutRepositoryImpl());
const loggingOut = ref(false);

async function logout() {
  if (loggingOut.value) return;
  loggingOut.value = true;
  try {
    const result = await logoutUseCase.execute({ token: session.value?.token ?? '' });
    if (result instanceof Failure) {
      showToast(result.message, 'fi-rr-exclamation', 'error');
      return;
    }
    clearSession();
    await router.replace('/auth/login');
    showToast('Déconnexion réussie.', 'fi-rr-check', 'success');
  } catch {
    showToast('Impossible de terminer la déconnexion.', 'fi-rr-exclamation', 'error');
  } finally {
    loggingOut.value = false;
  }
}

defineEmits(['navigate']);
const route = useRoute();
const canAccessManager = useState<boolean>('can-access-manager', () => false);

const groups = [
  {
    label: 'Espace principal',
    items: [
      { path: '/manager/dashboard', label: 'Accueil', icon: 'home' },
      { path: '/manager/upload', label: 'Upload photos', icon: 'cloud-upload-alt' },
      { path: '/manager/events', label: 'Événements', icon: 'calendar' },
    ],
  },
  {
    label: 'Compte',
    items: [
      { path: '/manager/subscription', label: 'Abonnement', icon: 'credit-card' },
      { path: '/manager/profile', label: 'Mon profil', icon: 'user' },
    ],
  },
  {
    label: 'Manager',
    items: [
      { path: '/manager/plans', label: 'Plans d’abonnement', icon: 'credit-card' },
      { path: '/manager/users', label: 'Utilisateurs', icon: 'users' },
    ],
  },
];

const visibleGroups = computed(() => {
  if (canAccessManager.value) {
    return groups;
  }

  return groups.filter(group => group.label !== 'Manager');
});

function isActive(path: string) {
  const currentPath = route.path.replace(/\/+$/, '');
  return currentPath === path || currentPath.startsWith(path + '/');
}
</script>

<style scoped>
.logout-loading { --spinner-color: currentColor; --spinner-track: transparent; }
button { width: 100%; border: 0; background: var(--app-transparent); font: inherit; text-align: left; cursor: pointer; }
button.logout:disabled { opacity: .6; cursor: wait; }
nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.label {
  padding: 8px 14px 6px;
  font-size: 11px;
  font-weight: 500;
  line-height: 1.4;
  color: var(--app-textOnNavyMuted);
}
.account {
  margin-top: 18px;
  padding-top: 20px;
  border-top: 1px solid var(--app-surfaceAlpha0D);
}
a, .logout {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 14px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--app-textOnDarkSecondary);
  font-size: 13px;
}
a:hover {
  background: var(--app-surfaceAlpha0D);
}
a.active {
  background: var(--app-primary);
  color: var(--app-surface);
}
i {
  display: flex;
  font-size: 18px;
  line-height: 1;
}
.logout {
  margin-top: auto;
  border-top: 1px solid var(--app-surfaceAlpha12);
  border-radius: 0;
  padding-top: 22px;
  background-image: linear-gradient(var(--app-surfaceAlpha0D), var(--app-surfaceAlpha0D));
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 0% 100%;
  transition: background-size 300ms ease;
}
.logout:hover:not(:disabled), .logout:focus-visible {
  background-size: 100% 100%;
}
@media (prefers-reduced-motion: reduce) {
  .logout { transition: none; }
}
</style>
