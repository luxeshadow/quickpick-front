<template>
  <AuthPageLayout>
<!-- HEADER -->

          <div class="login-header">

            <span class="welcome">
              Welcome back
            </span>

            <h1>
              Sign in to your account
            </h1>

            <p>
              Enter your details below to continue
              to your QuickPick account.
            </p>

          </div>


          <!-- FORM -->

          <form
            class="login-form"
            @submit.prevent="login"
          >

            <Input
              v-model="email"
              type="email"
              label="Email address"
              placeholder="Enter your email"
              prefix-icon="fi fi-rr-at"
              autocomplete="email"
              required
            />


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
              autocomplete="current-password"
              required
              @suffix-click="togglePassword"
            />


            <!-- OPTIONS -->

            <div class="login-options">


              <NuxtLink to="/auth/forgot-password"
                class="forgot-password"
              >
                Forgot password?
              </NuxtLink>

            </div>


            <!-- BUTTON -->

            <Button
              :label="isSubmitting ? 'Signing in…' : 'Sign in'"
              :disabled="isSubmitting"
              icon="fi fi-rr-arrow-right-to-bracket"
              type="submit"
            />

          </form>


          <GoogleSignIn />
          <!-- REGISTER -->

          <div class="register">

            <span>
              Don't have an account?
            </span>

            <NuxtLink to="/auth/register">
              Create an account
            </NuxtLink>

          </div>
  </AuthPageLayout>
</template>

<script setup lang="ts">
import GoogleSignIn from '../components/GoogleSignIn.vue';
import AuthPageLayout from '../components/AuthPageLayout.vue';
import { ref } from 'vue';
import { useRouter } from '#imports';
import { useToast } from '../../../../core/shared/useToast';
import { Failure } from '../../../../core/error/failure';
import { LoginUseCase } from '../../application/usecases/login_usecase';
import { LoginRepositoryImpl } from '../../data/repositories/login_repository_impl';
import Input from '../../../../core/components/other/Input.vue';
import Button from '../../../../core/components/other/Button.vue';
import { AppColors } from '../../../../core/constants/app_colors';
import type { LoginParam } from '../../application/params/login_param';

const colors = AppColors;
const router = useRouter();
const { showToast } = useToast();
const loginUseCase = new LoginUseCase(new LoginRepositoryImpl());

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isSubmitting = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const login = async () => {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    const params: LoginParam = {
      email: email.value,
      password: password.value,
    };
    const result = await loginUseCase.execute(params);
    if (result instanceof Failure) {
      showToast(result.message, 'fi-rr-exclamation', 'error');
      return;
    }

    password.value = '';
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

  justify-content: flex-end;

  gap: 15px;

  margin-top: -3px;
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
</style>
