<template>
  <AuthPageLayout>
    <header class="page-header">
      <span class="eyebrow">Account recovery</span>
      <h1>Set a new password</h1>
      <p>Choose a new password for your QuickPick account.</p>
    </header>
    <form class="auth-form" novalidate @submit.prevent="resetPassword">
      <Input
        v-model="newPassword"
        type="password"
        name="new-password"
        label="New password"
        placeholder="Enter your new password"
        prefix-icon="fi fi-rr-lock"
        autocomplete="new-password"
      />
      <Input
        v-model="confirmNewPassword"
        type="password"
        name="confirm-new-password"
        label="Confirm new password"
        placeholder="Confirm your new password"
        prefix-icon="fi fi-rr-lock"
        autocomplete="new-password"
      />
      <Button :label="loading ? 'Resetting...' : 'Reset password'" :disabled="loading" type="submit" />
    </form>
    <NuxtLink class="back-link" to="/auth/login">Back to sign in</NuxtLink>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth_store';
import { ref } from 'vue';
import { useRoute, useRouter } from '#imports';
import { Failure } from '../../../../core/error/failure';
import { useToast } from '../../../../core/shared/useToast';
import { ResetPasswordUseCase } from '../../application/usecases/reset_password_usecase';
import { ResetPasswordRepositoryImpl } from '../../data/repositories/reset_password_repository_impl';
import AuthPageLayout from '../components/AuthPageLayout.vue';
import Input from '../../../../core/components/other/Input.vue';
import Button from '../../../../core/components/other/Button.vue';
import { AppColors } from '../../../../core/constants/app_colors';

const colors = AppColors;
const newPassword = ref('');
const confirmNewPassword = ref('');
const route = useRoute();
const router = useRouter();
const { showToast } = useToast();
const { clearSession } = useAuthStore();
const loading = ref(false);
const resetPasswordUseCase = new ResetPasswordUseCase(new ResetPasswordRepositoryImpl());

async function resetPassword() {
  if (loading.value) return;
  loading.value = true;
  const result = await resetPasswordUseCase.execute({
    email: typeof route.query.email === 'string' ? route.query.email : '',
    token: typeof route.query.token === 'string' ? route.query.token : '',
    password: newPassword.value,
    confirmPassword: confirmNewPassword.value,
  });
  loading.value = false;

  if (result instanceof Failure) {
    showToast(result.message, 'fi-rr-exclamation', 'error');
    return;
  }
  newPassword.value = '';
  confirmNewPassword.value = '';
  clearSession();
  await router.replace('/auth/login');
  showToast(result, 'fi-rr-check', 'success');
}
</script>

<style scoped>
.page-header { margin-bottom: 30px; }
.eyebrow { display: block; margin-bottom: 10px; color: v-bind('colors.primary'); font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
h1 { margin: 0 0 12px; color: v-bind('colors.textPrimary'); font-size: 30px; line-height: 1.2; letter-spacing: -.9px; }
.page-header p { margin: 0; color: v-bind('colors.textSecondary'); font-size: 14px; line-height: 1.7; }
.auth-form { display: flex; flex-direction: column; gap: 24px; }
.back-link { display: block; width: fit-content; margin: 26px auto 0; color: v-bind('colors.primary'); font-size: 13px; font-weight: 600; text-decoration: none; }
.back-link:hover { text-decoration: underline; }
.back-link:focus-visible { outline: 2px solid v-bind('colors.primary'); outline-offset: 4px; }
@media (max-width: 430px) { h1 { font-size: 25px; } }
</style>