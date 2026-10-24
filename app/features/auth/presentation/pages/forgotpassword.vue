<template>
  <AuthPageLayout>
    <header class="page-header">
      <span class="eyebrow">Account recovery</span>
      <h1>Forgot your password?</h1>
      <p>Enter the email address linked to your account to request password reset instructions.</p>
    </header>
    <form class="auth-form" @submit.prevent="requestReset">
      <Input v-model="email" type="email" name="email" label="Email address" placeholder="Enter your email"
        prefix-icon="fi fi-rr-at" autocomplete="email" required />

      <Button :label="loading ? 'Sending...' : 'Send reset instructions'" :disabled="loading" type="submit" />
    </form>
    <NuxtLink class="back-link" to="/auth/login">Back to sign in</NuxtLink>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from '../../../../core/shared/useToast';
import { Failure } from '../../../../core/error/failure';
import { ForgotPasswordUseCase } from '../../application/usecases/forgot_password_usecase';
import { ForgotPasswordRepositoryImpl } from '../../data/repositories/forgot_password_repository_impl';
import AuthPageLayout from '../components/AuthPageLayout.vue';
import Input from '../../../../core/components/other/Input.vue';
import Button from '../../../../core/components/other/Button.vue';
import { AppColors } from '../../../../core/constants/app_colors';
const colors = AppColors;
const email = ref('');
const { showToast } = useToast();
const loading = ref(false);
const forgotPassword = new ForgotPasswordUseCase(new ForgotPasswordRepositoryImpl());

async function requestReset() {
  if (loading.value) return;
  loading.value = true;
  const result = await forgotPassword.execute({ email: email.value });
  loading.value = false;

  if (result instanceof Failure) {
    showToast(result.message, 'fi-rr-exclamation', 'error');
    return;
  }
  showToast(result, 'fi-rr-check', 'success');
}
</script>
<style scoped>
.page-header { margin-bottom: 30px; }
.eyebrow { display: block; margin-bottom: 10px; color: v-bind('colors.primary'); font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
h1 { margin: 0 0 12px; color: v-bind('colors.textPrimary'); font-size: 30px; line-height: 1.2; letter-spacing: -.9px; }
.page-header p { margin: 0; color: v-bind('colors.textSecondary'); font-size: 14px; line-height: 1.7; }
.auth-form { display: flex; flex-direction: column; gap: 24px; }
.feedback { margin: 0; color: v-bind('colors.textSecondary'); font-size: 13px; line-height: 1.6; }
.error { color: v-bind('colors.danger'); }
.back-link { display: block; width: fit-content; margin: 26px auto 0; color: v-bind('colors.primary'); font-size: 13px; font-weight: 600; text-decoration: none; }
.back-link:hover { text-decoration: underline; }
.back-link:focus-visible, .resend-button:focus-visible { outline: 2px solid v-bind('colors.primary'); outline-offset: 4px; }
.otp-label { color: v-bind('colors.textPrimary'); font-size: 13px; font-weight: 600; }
.otp-control { position: relative; margin-top: 10px; border-radius: 12px; }
.otp-input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: .01; z-index: 1; border: 0; font-size: 16px; cursor: text; }
.otp-digits { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
.otp-digit { display: flex; align-items: center; justify-content: center; height: 58px; border: 1.5px solid v-bind('colors.border'); border-radius: 12px; background: v-bind('colors.surfaceSoft'); color: v-bind('colors.textPrimary'); font-size: 24px; font-weight: 600; }
.otp-control:focus-within { outline: 2px solid v-bind('colors.primary'); outline-offset: 4px; }
.otp-control:focus-within .otp-digit.active { border-color: v-bind('colors.primary'); background: v-bind('colors.infoLight'); }
.otp-control.invalid .otp-digit { border-color: v-bind('colors.danger'); }
.resend { margin-top: 24px; display: flex; justify-content: center; flex-wrap: wrap; gap: 5px; color: v-bind('colors.textSecondary'); font-size: 13px; }
.resend-button { border: 0; padding: 0; background: var(--app-transparent); color: v-bind('colors.primary'); font: inherit; font-weight: 600; cursor: pointer; }
@media (max-width: 430px) { h1 { font-size: 25px; } .otp-digits { gap: 6px; } .otp-digit { height: 50px; font-size: 22px; } }
</style>