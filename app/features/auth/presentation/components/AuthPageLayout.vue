<template>

  <main class="login-page">

    <section class="login-container">


      <!-- =====================================
           VISUAL SIDE - DESKTOP
      ====================================== -->

      <div class="login-visual">

        <div class="visual-glow glow-one"></div>
        <div class="visual-glow glow-two"></div>


        <!-- BRAND -->

        <div class="visual-brand">

          <div class="visual-logo">

            <AppLogo />

          </div>

        </div>


        <!-- TEXT -->

        <div class="visual-content">

          <div class="visual-badge">

            <i class="fi fi-rr-camera"></i>

            <span>
              QuickPick
            </span>

          </div>


          <h2>
            Every moment.
            <span>
              Instantly yours.
            </span>
          </h2>


          <p>
            Find and access your event photos
            quickly with facial recognition.
          </p>

        </div>


        <!-- IMAGE -->

        <div class="visual-image-wrapper">

          <div class="image-light"></div>

          <img
            :src="AppImages.loginPhotographer"
            alt="Photographer"
            class="visual-image"
          />

        <div class="visual-floating-card card-one">

          <div class="floating-icon">
            <i class="fi fi-rr-camera"></i>
          </div>

          <div>
            <strong>
              Instant photos
            </strong>

            <span>
              Ready in seconds
            </span>
          </div>

        </div>

        </div>


        <div class="visual-dots">

          <span></span>
          <span></span>
          <span></span>

        </div>

      </div>


      <!-- =====================================
           FORM SIDE
      ====================================== -->

      <div class="login-form-side" :class="{ 'has-mobile-appbar': !!$slots['mobile-appbar'] }">
        <slot name="mobile-appbar" />

        <div class="mobile-logo">

          <AppLogo />

        </div>


        <div class="form-content"><slot /></div>



        <!-- BOTTOM -->

        <div class="login-bottom">

          <span>
            © {{ currentYear }} QuickPick
          </span>

          <a href="#">
            Privacy
          </a>

        </div>

      </div>

    </section>

  </main>

</template>

<script setup lang="ts">
import AppLogo from '../../../../core/components/other/AppLogo.vue';
import { AppImages } from '../../../../core/constants/app_images';
import { AppColors } from '../../../../core/constants/app_colors';
const colors = AppColors;
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;

  display: flex;

  align-items: center;
  justify-content: center;

  padding: 28px;

  background:
    v-bind('colors.background');
}

.login-container {
  width: 100%;
  max-width: 1180px;

  min-height: 720px;

  display: grid;

  grid-template-columns:
    minmax(470px, 1.08fr)
    minmax(420px, 0.92fr);

  overflow: hidden;

  background:
    v-bind('colors.surface');

  border:
    1px solid v-bind('colors.borderLight');

  border-radius: 28px;

  box-shadow:
    0 30px 80px
    v-bind('colors.black10');
}

.login-visual {
  position: relative;

  min-height: 720px;

  overflow: hidden;

  padding: 40px;

  background:
    v-bind('colors.navyDark');

  isolation: isolate;
}

.visual-glow {
  position: absolute;

  border-radius: 50%;

  filter: blur(5px);

  pointer-events: none;

  z-index: -1;
}

.glow-one {
  width: 430px;
  height: 430px;

  top: -190px;
  left: -160px;

  background:
    v-bind('colors.primary20');
}

.glow-two {
  width: 420px;
  height: 420px;

  bottom: -190px;
  right: -150px;

  background:
    v-bind('colors.primary30');

  opacity: 0.7;
}

.visual-brand {
  position: relative;

  z-index: 4;

  display: flex;
  align-items: center;
}

.visual-logo { display: flex; align-items: center; }



.visual-content {
  position: relative;

  z-index: 4;

  max-width: 450px;

  margin-top: 52px;
}

.visual-badge {
  width: fit-content;

  display: flex;
  align-items: center;

  gap: 8px;

  padding: 7px 12px;

  margin-bottom: 20px;

  border:
    1px solid v-bind('colors.white10');

  border-radius: 30px;

  background:
    v-bind('colors.white05');

  color:
    v-bind('colors.primaryLight');

  font-size: 12px;
  font-weight: 600;
}

.visual-badge i {
  display: flex;
}

.visual-content h2 {
  max-width: 430px;

  margin: 0;

  color:
    v-bind('colors.white');

  font-size: clamp(38px, 4vw, 57px);

  font-weight: 800;

  line-height: 1.03;

  letter-spacing: -2px;
}

.visual-content h2 span {
  display: block;

  color:
    v-bind('colors.primaryLight');
}

.visual-content p {
  max-width: 390px;

  margin:
    20px 0 0;

  color:
    v-bind('colors.textOnDarkSecondary');

  font-size: 14px;

  line-height: 1.8;
}

.visual-image-wrapper {
  position: absolute;

  width: 410px;
  height: 340px;

  right: -20px;
  bottom: 10px;

  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
}

.image-light {
  position: absolute;

  width: 320px;
  height: 250px;

  border-radius: 50%;

  background:
    v-bind('colors.primary30');

  filter: blur(70px);

  opacity: 0.65;
}

.visual-image {
  position: relative;

  width: 390px;
  max-height: 330px;

  object-fit: contain;

  border-radius: 30px;

  transform:
    rotate(-2deg);

  box-shadow:
    0 30px 80px
    v-bind('colors.black20');
}

.visual-floating-card {
  position: absolute;

  z-index: 5;

  display: flex;
  align-items: center;

  gap: 11px;

  padding: 11px 14px;

  border:
    1px solid v-bind('colors.white10');

  border-radius: 15px;

  background:
    v-bind('colors.white10');

  backdrop-filter:
    blur(14px);

  box-shadow:
    0 12px 35px
    v-bind('colors.black20');
}

.card-one {
  left: 10px;
  bottom: 37px;
  transform: translateX(-50%);
}

.floating-icon {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 11px;

  background:
    v-bind('colors.primary');

  color:
    v-bind('colors.white');
}

.floating-icon i {
  display: flex;
}

.visual-floating-card div:last-child {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.visual-floating-card strong {
  color:
    v-bind('colors.white');

  font-size: 11px;
}

.visual-floating-card span {
  color:
    v-bind('colors.textOnDarkSecondary');

  font-size: 9px;
}

.visual-dots {
  position: absolute;

  top: 42px;
  right: 40px;

  display: flex;

  gap: 6px;
}

.visual-dots span {
  width: 5px;
  height: 5px;

  border-radius: 50%;

  background:
    v-bind('colors.primaryLight');
}

.visual-dots span:nth-child(2) {
  opacity: 0.6;
}

.visual-dots span:nth-child(3) {
  opacity: 0.3;
}

.login-form-side {
  min-width: 0;

  display: flex;

  flex-direction: column;

  padding:
    42px 58px 30px;

  background:
    v-bind('colors.surface');
}

.mobile-logo {
  display: none;
}



.form-content {
  width: 100%;

  max-width: 410px;

  margin: auto;
}

.login-bottom {
  display: flex;

  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-top: 35px;

  color:
    v-bind('colors.textMuted');

  font-size: 10px;
}

.login-bottom a {
  color:
    v-bind('colors.textMuted');

  text-decoration: none;
}

.login-bottom a:hover {
  color:
    v-bind('colors.primary');
}

@media (max-width: 980px) {

  .login-container {
    grid-template-columns:
      minmax(0, 0.9fr)
      minmax(0, 1.1fr);
  }

  .login-form-side {
    padding:
      40px;
  }

  .visual-image-wrapper {
    width: 350px;

    right: -65px;
  }

  .visual-image {
    width: 340px;
  }

  .visual-content h2 {
    font-size: 42px;
  }

}

@media (max-width: 900px) {

  .login-page {
    min-height: 100dvh;

    align-items: flex-start;

    padding: 0;

    background:
      v-bind('colors.surface');
  }
  .login-container {
    display: block;

    max-width: none;
    min-height: 100dvh;

    border: none;

    border-radius: 0;

    box-shadow: none;

    background:
      v-bind('colors.surface');
  }

  .login-visual {
    display: none;
  }

  .login-form-side {
    min-height: 100dvh;

    padding:
      35px 22px 24px;

    background:
      v-bind('colors.surface');
  }

  .mobile-logo {
    display: flex;

    align-items: center;

    margin-bottom: 65px;
  }

  .form-content {
    max-width: 440px;

    margin:
      0 auto;
  }

  .login-bottom {
    width: 100%;

    max-width: 440px;

    margin:
      auto auto 0;
  }

}

@media (max-width: 430px) {

  .login-form-side {
    padding:
      28px 18px 22px;
  }

  .mobile-logo {
    margin-bottom: 50px;
  }

  

}

@media (max-width: 900px) {
  .login-form-side.has-mobile-appbar { padding-top: 12px; }
  .has-mobile-appbar .mobile-logo { margin-bottom: 28px; }
  .has-mobile-appbar .login-bottom { padding-top: 28px; }
}
</style>
