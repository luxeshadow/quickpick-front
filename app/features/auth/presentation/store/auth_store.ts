import { useCookie } from '#imports';
import { ref } from 'vue';
import { defineStore } from 'pinia';

type AuthSession = {
  token: string;
  user: Record<string, unknown>;
};

export const useAuthStore = defineStore('auth', () => {
  const cookie = useCookie<AuthSession | null>('auth-session', {
    default: () => null,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
  });
  const session = ref<AuthSession | null>(cookie.value);

  function setSession(value: AuthSession) {
    session.value = { token: value.token, user: value.user };
    cookie.value = session.value;
  }

  function clearSession() {
    session.value = null;
    cookie.value = null;
  }

  return { session, setSession, clearSession };
});
