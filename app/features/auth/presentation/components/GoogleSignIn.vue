<template>
  <div class="google-sign-in" :aria-busy="loading">
    <div class="google-button" aria-hidden="true">
      <LoadingSpinner v-if="loading" inline :size="20" label="Connexion Google en cours" />
      <img v-else :src="AppImages.google" alt="" width="20" height="20" />
      <span>Continue with Google</span>
    </div>
    <div ref="button" class="google-click-target" v-show="!loading && !unavailable" />
    <button v-if="unavailable" class="google-fallback" type="button" aria-label="Continue with Google"
      @click="showToast('La connexion Google est indisponible pour le moment.', 'fi-rr-info')" />

  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '../../../../core/components/other/LoadingSpinner.vue';
import { useAuthStore } from '../store/auth_store';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRuntimeConfig, useRouter } from '#imports';
import { AppImages } from '../../../../core/constants/app_images';
import { AppColors } from '../../../../core/constants/app_colors';
import { useToast } from '../../../../core/shared/useToast';
import { Failure } from '../../../../core/error/failure';
import { LoginByGoogleUseCase } from '../../application/usecases/login_by_google_usecase';
import { LoginByGoogleRepositoryImpl } from '../../data/repositories/login_by_google_repository_impl';

interface GoogleIdentity {
  initialize(options: { client_id: string; callback: (response: { credential: string }) => void }): void;
  renderButton(element: HTMLElement, options: { theme: string; size: string; text: string; width: number }): void;
}
const colors = AppColors;
const config = useRuntimeConfig();
const router = useRouter();
const { showToast } = useToast();
const { setSession } = useAuthStore();
const useCase = new LoginByGoogleUseCase(new LoginByGoogleRepositoryImpl());
const button = ref<HTMLElement>();
const loading = ref(false);
const unavailable = ref(false);
let disposed = false;
let cleanup = () => {};
const identity = () => (window as Window & { google?: { accounts: { id: GoogleIdentity } } }).google?.accounts.id;

async function handleCredential(response: { credential: string }) {
  if (disposed || loading.value) return;
  loading.value = true;
  try {
    const result = await useCase.execute({ idToken: response.credential ?? '' });
    if (disposed) return;
    if (result instanceof Failure) {
      showToast(result.message, 'fi-rr-exclamation', 'error');
      return;
    }
    setSession(result);
    await router.replace('/manager/dashboard');
    showToast(result.message, 'fi-rr-check', 'success');
  } catch {
    if (!disposed) showToast('Impossible de se connecter avec Google.', 'fi-rr-exclamation', 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  const clientId = String(config.public.googleClientId || '').trim();
  if (!clientId) { unavailable.value = true; return; }
  const render = () => {
    if (disposed) return;
    const api = identity();
    if (!api || !button.value) { unavailable.value = true; return; }
    api.initialize({ client_id: clientId, callback: handleCredential });
    api.renderButton(button.value, { theme: 'outline', size: 'large', text: 'continue_with', width: Math.min(button.value.clientWidth || 320, 400) });
  };
  if (identity()) { render(); return; }
  let script = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
  const isNew = !script;
  if (!script) {
    script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
  }
  const loaded = () => { cleanup(); render(); };
  const failed = () => { cleanup(); if (!disposed) unavailable.value = true; };
  const timeout = setTimeout(failed, 15000);
  cleanup = () => {
    clearTimeout(timeout);
    script?.removeEventListener('load', loaded);
    script?.removeEventListener('error', failed);
  };
  script.addEventListener('load', loaded);
  script.addEventListener('error', failed);
  if (isNew) document.head.appendChild(script);
});
onBeforeUnmount(() => { disposed = true; cleanup(); });
</script>

<style scoped>
.google-button {
  width: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px 16px;
  border: 1px solid v-bind('colors.border');
  border-radius: 13px;
  background: linear-gradient(180deg, v-bind('colors.surface'), v-bind('colors.backgroundLight'));
  color: v-bind('colors.textPrimary');
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.google-button img {
  flex-shrink: 0;
  object-fit: contain;
}

.google-button:hover {
  border-color: v-bind('colors.textMuted');
  box-shadow: 0 2px 8px v-bind('colors.black10');
}

.google-button:focus-visible {
  outline: 2px solid v-bind('colors.primary');
  outline-offset: 3px;
}

.google-sign-in { position: relative; }
.google-button { pointer-events: none; }
.google-sign-in:hover .google-button { border-color: v-bind('colors.textMuted'); box-shadow: 0 2px 8px v-bind('colors.black10'); }
.google-sign-in:focus-within .google-button { outline: 2px solid v-bind('colors.primary'); outline-offset: 3px; }
.google-click-target, .google-fallback { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; overflow: hidden; cursor: pointer; }
.google-click-target :deep(iframe) { width: 100% !important; height: 100% !important; margin: 0 !important; }
.google-click-target :deep(div) { width: 100% !important; height: 100%; }
.google-sign-in[aria-busy="true"] { cursor: wait; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
