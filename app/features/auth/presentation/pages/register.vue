<template>
  <AuthPageLayout>
<template #mobile-appbar>
<header class="register-appbar">
          <button type="button" class="back-button" aria-label="Go back" @click="goBack">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5m7-7-7 7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <span>Create account</span>
        </header>
</template>
<!-- HEADER -->

          <div class="login-header">

            <span class="welcome">
              Join QuickPick
            </span>

            <h1>
              Create your account
            </h1>

            <p>
              Sign up to find and enjoy your event photos.
              Your favorite moments are waiting.
            </p>

          </div>


          <!-- FORM -->

          <form
            class="login-form"
            @submit.prevent="register"
          >

            <Input
              v-model="fullName"
              label="Full name"
              placeholder="Enter your full name"
              prefix-icon="fi fi-rr-user"
              autocomplete="name"
              required
            />
            <Input
              v-model="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              prefix-icon="fi fi-rr-at"
              autocomplete="email"
              required
            />
            <PhoneInput v-model="phone" />



            <Input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              placeholder="Enter your password"
              prefix-icon="fi fi-rr-lock"
              :suffix-icon="
                showPassword
                  ? 'fi fi-rr-eye-crossed'
                  : 'fi fi-rr-eye'
              "
              autocomplete="new-password"
              required
              @suffix-click="togglePassword"
            />


            <Input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              label="Confirm password"
              placeholder="Enter your password again"
              prefix-icon="fi fi-rr-lock"
              autocomplete="new-password"
              required
            />
            <!-- BUTTON -->

            <Button
              :label="isSubmitting ? 'Creating account…' : 'Create account'"
              :loading="isSubmitting" :disabled="isSubmitting"
              icon="fi fi-rr-arrow-right-to-bracket"
              type="submit"
            />

          </form>


          <GoogleSignIn />
          <!-- REGISTER -->

          <div class="register">

            <span>
              Already have an account?
            </span>

            <NuxtLink to="/auth/login">
              Sign in
            </NuxtLink>

          </div>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import GoogleSignIn from '../components/GoogleSignIn.vue';
import AuthPageLayout from '../components/AuthPageLayout.vue';
import { ref } from 'vue';
import { useRouter } from '#imports';
import { Failure } from '../../../../core/error/failure';
import { useToast } from '../../../../core/shared/useToast';
import { RegisterUseCase } from '../../application/usecases/register_usecase';
import { RegisterRepositoryImpl } from '../../data/repositories/register_repository_impl';
import Input from '../../../../core/components/other/Input.vue';
import PhoneInput from '../../../../core/components/other/PhoneInput.vue';
import Button from '../../../../core/components/other/Button.vue';
import { AppColors } from '../../../../core/constants/app_colors';
import type { RegisterParam } from '../../application/params/register_param';

const colors = AppColors;
const router = useRouter();
const { showToast } = useToast();
const registerUseCase = new RegisterUseCase(new RegisterRepositoryImpl());

const fullName = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const isSubmitting = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const goBack = () => {
  if (window.history.state?.back) {
    router.back();
  } else if (document.referrer && window.history.length > 1) {
    window.history.back();
  } else {
    router.replace('/auth/login');
  }
};

const register = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const params: RegisterParam = {
      fullName: fullName.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };
    const result = await registerUseCase.execute(params);
    if (result instanceof Failure) {
      showToast(result.message, 'fi-rr-exclamation', 'error');
      return;
    }

    password.value = '';
    confirmPassword.value = '';
    await router.replace({ path: '/auth/otp', query: { email: result.email } });
    showToast(result.message, 'fi-rr-check', 'success');
  } catch {
    showToast('Une erreur inattendue est survenue. Réessayez.', 'fi-rr-exclamation', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.login-header {
  margin-bottom: 34px;
}

.welcome {
  display: inline-block;

  margin-bottom: 10px;

  color:
    v-bind('colors.primary');

  font-size: 12px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 1px;
}

.login-header h1 {
  margin: 0;

  color:
    v-bind('colors.textPrimary');

  font-size: 30px;

  line-height: 1.2;

  font-weight: 800;

  letter-spacing: -0.9px;
}

.login-header p {
  max-width: 340px;

  margin:
    10px 0 0;

  color:
    v-bind('colors.textSecondary');

  font-size: 13px;

  line-height: 1.7;
}

.login-form {
  display: flex;

  flex-direction: column;

  gap: 21px;
}

.login-options {
  flex-wrap: wrap;
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 15px;

  margin-top: -3px;
}

.remember {
  display: flex;

  align-items: center;

  gap: 8px;

  color:
    v-bind('colors.textSecondary');

  font-size: 12px;

  cursor: pointer;

  user-select: none;
}

.remember input {
  display: none;
}

.checkbox {
  width: 17px;
  height: 17px;

  position: relative;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1.5px solid v-bind('colors.border');

  border-radius: 5px;

  background:
    v-bind('colors.surface');

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.remember input:checked + .checkbox {
  background:
    v-bind('colors.primary');

  border-color:
    v-bind('colors.primary');
}

.remember input:checked + .checkbox::after {
  content: '';

  width: 7px;
  height: 4px;

  margin-top: -2px;

  border-left:
    2px solid v-bind('colors.white');

  border-bottom:
    2px solid v-bind('colors.white');

  transform:
    rotate(-45deg);
}

.forgot-password {
  color:
    v-bind('colors.primary');

  font-size: 12px;

  font-weight: 700;

  text-decoration: none;

  transition:
    color 0.2s ease;
}

.forgot-password:hover {
  color:
    v-bind('colors.primaryHover');
}

.register {
  display: flex;

  align-items: center;
  justify-content: center;

  flex-wrap: wrap;

  gap: 5px;

  margin-top: 28px;

  color:
    v-bind('colors.textSecondary');

  font-size: 12px;
}

.register a {
  color:
    v-bind('colors.primary');

  font-weight: 700;

  text-decoration: none;
}

.register a:hover {
  color:
    v-bind('colors.primaryHover');
}

@media (max-width: 900px) {

  .login-header {
    margin-bottom: 32px;
  }

  .login-header h1 {
    font-size: 27px;
  }

  .login-header p {
    font-size: 13px;
  }

}

@media (max-width: 430px) {

  .login-header h1 {
    font-size: 25px;
  }

  .login-options {
  flex-wrap: wrap;
    gap: 8px;
  }

}

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

.register-appbar {
  display: none;
}

.form-message {
  margin: 0;
  color: v-bind('colors.textSecondary');
  font-size: 13px;
  line-height: 1.5;
}

@media (max-width: 900px) {
  .register-appbar {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
    margin-bottom: 24px;
    padding-top: env(safe-area-inset-top, 0px);
    border-bottom: 1px solid v-bind('colors.borderLight');
    color: v-bind('colors.textPrimary');
    font-size: 15px;
    font-weight: 600;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: var(--app-transparent);
    color: inherit;
    cursor: pointer;
  }

  .back-button:hover {
    background: v-bind('colors.backgroundLight');
  }

  .back-button:focus-visible {
    outline: 2px solid v-bind('colors.primary');
    outline-offset: 2px;
  }
}
</style>
