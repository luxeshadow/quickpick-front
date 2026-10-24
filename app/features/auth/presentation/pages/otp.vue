<template>
  <AuthPageLayout>
    <header class="page-header">
      <span class="eyebrow">Account verification</span>
      <h1>Enter your verification code</h1>

      <p>
        Enter the 6-digit code sent to {{ email }}
      </p>
    </header>

    <form class="auth-form" @submit.prevent="verifyCode">
      <div>
        <label class="otp-label" for="code">Verification code</label>

        <div class="otp-control" :class="{ invalid: error }">
          <input
            id="code"
            class="otp-input"
            v-model="code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            :aria-invalid="Boolean(error)"
            :aria-describedby="error ? 'otp-error' : undefined"
          />

          <div class="otp-digits" aria-hidden="true">
            <span
              v-for="index in 6"
              :key="index"
              class="otp-digit"
              :class="{ active: index - 1 === Math.min(code.length, 5) }"
            >
              {{ code[index - 1] }}
            </span>
          </div>
        </div>
      </div>
      <p v-if="error" id="otp-error" class="feedback error">
        {{ error }}
      </p>

      <Button
        :label="loading ? 'Verifying...' : 'Verify code'"
        :disabled="busy"
        type="submit"
      />
    </form>

    <div class="resend">
      <span>Didn't receive a code?</span>

      <button
        type="button"
        class="resend-button"
        :disabled="busy"
        @click="resendCode"
      >
        Resend code
      </button>
    </div>

    <NuxtLink class="back-link" to="/auth/login">
      Back to sign in
    </NuxtLink>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import { useAuthStore } from '../store/auth_store';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from '#imports';
import AuthPageLayout from '../components/AuthPageLayout.vue';
import Button from '../../../../core/components/other/Button.vue';
import { AppColors } from '../../../../core/constants/app_colors';
import { useToast } from '../../../../core/shared/useToast';
import { Failure } from '../../../../core/error/failure';
import { VerifyOtpUseCase } from '../../application/usecases/verify_otp_usecase';
import { VerifyOtpRepositoryImpl } from '../../data/repositories/verify_otp_repository_impl';
import { ResendOtpUseCase } from '../../application/usecases/resend_otp_usecase';
import { ResendOtpRepositoryImpl } from '../../data/repositories/resend_otp_repository_impl';

const { setSession } = useAuthStore();
const colors = AppColors;
const { showToast } = useToast();
const route = useRoute();
const router = useRouter();
const verifyOtp = new VerifyOtpUseCase(new VerifyOtpRepositoryImpl());
const resendOtp = new ResendOtpUseCase(new ResendOtpRepositoryImpl());
const email = computed(() => typeof route.query.email === 'string' ? route.query.email : '');
const code = ref('');
const error = ref('');
const action = ref<'verify' | 'resend' | null>(null);
const loading = computed(() => action.value === 'verify');
const resending = computed(() => action.value === 'resend');
const busy = computed(() => action.value !== null);

const verifyCode = () => submit('verify');
const resendCode = () => submit('resend');

async function submit(type: 'verify' | 'resend') {
  if (busy.value) return;
  action.value = type;
  error.value = '';
  try {
    const result = type === 'verify'
      ? await verifyOtp.execute({ email: email.value, code: code.value })
      : await resendOtp.execute({ email: email.value });
    if (result instanceof Failure) {
      error.value = result.message;
      showToast(result.message, 'fi-rr-exclamation', 'error');
      return;
    }
    code.value = '';
    if (type === 'verify' && result) {
      setSession(result);
      await router.replace('/manager/dashboard');
    } else {
      showToast('Un nouveau code a été envoyé. Utilisez-le à la place de l’ancien.', 'fi-rr-check', 'success');
    }
  } catch {
    showToast('Impossible de terminer la demande. Réessayez.', 'fi-rr-exclamation', 'error');
  } finally {
    action.value = null;
  }
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